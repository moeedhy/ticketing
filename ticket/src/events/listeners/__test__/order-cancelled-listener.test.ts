import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from "@moeedpubtest/common";
import mongoose from "mongoose";
import Ticket from "../../../models/ticket";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const ticket = Ticket.build({
    price: 2222,
    title: "ticket",
    userId: new mongoose.Types.ObjectId().toHexString(),
    orderId: "asdsasssa",
  });
  await ticket.save();
  const listener = new OrderCancelledListener(natsWrapper.client);
  const data: OrderCancelledEvent["data"] = {
    id: "asdsasssa",
    ticket: {
      id: ticket._id,
    },
    version: 1,
  };
  //@ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };
  return { listener, data, message };
};

it("should set orderId to undefined ", async function () {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const ticket = await Ticket.findById(data.ticket.id);
  expect(ticket!.orderId).not.toBeDefined();
});
it("should ack the message", async function () {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
it("should publish a ticket updated event", async function () {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
