import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@moeedpubtest/common";
import mongoose from "mongoose";
import Ticket from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const ticket = Ticket.build({
    price: 2222,
    title: "ticket",
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: ticket.userId,
    ticket: {
      id: ticket._id,
      price: ticket.price,
    },
    version: 0,
    status: OrderStatus.Created,
    expiredAt: new Date().toISOString(),
  };
  //@ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };
  return { listener, data, message };
};

it("should save orderId ", async function () {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const ticket = await Ticket.findById(data.ticket.id);
  expect(ticket!.orderId).toEqual(data.id);
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
