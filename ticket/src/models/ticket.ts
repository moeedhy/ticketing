import * as mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface TicketAtt {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
}
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(att: TicketAtt): TicketDoc;
}
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
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
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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
  }
);
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.set("versionKey", "version");
ticketSchema.statics.build = (att: TicketAtt) => {
  return new Ticket(att);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export default Ticket;
