import * as mongoose from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@moeedpubtest/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface TicketAtt {
  title: string;
  price: number;
  id: string;
}
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(att: TicketAtt): TicketDoc;
}
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    versionKey: "version",
  }
);
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (att: TicketAtt) => {
  return new Ticket({
    _id: att.id,
    title: att.title,
    price: att.price,
  });
};

ticketSchema.methods.isReserved = async function () {
  const order = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!order;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export default Ticket;
