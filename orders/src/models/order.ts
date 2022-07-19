import * as mongoose from "mongoose";
import { OrderStatus } from "@moeedpubtest/common";
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  userId: string;
  ticket: TicketDoc;
  expiredAt: Date;
  version: number;
}
interface OrderAtt {
  status: OrderStatus;
  userId: string;
  ticket: TicketDoc;
  expiredAt: Date;
}
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(att: OrderAtt): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    userId: {
      type: String,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Ticket",
    },
    expiredAt: {
      type: mongoose.Schema.Types.Date,
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
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build = (attrs: OrderAtt) => {
  return new Order(attrs);
};
const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
