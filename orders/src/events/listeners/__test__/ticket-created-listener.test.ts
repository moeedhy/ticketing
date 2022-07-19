import { TicketCreateListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@moeedpubtest/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import Ticket from "../../../models/ticket";
const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreateListener(natsWrapper.client);
  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    title: "ticket",
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 222,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };
  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };
  return { listener, data, message };
};
it("should creates and saves a ticket", async function () {
  const { listener, data, message } = await setup();
  // call the on message function with the data object
  await listener.onMessage(data, message);
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
});

it("should ack the message", async function () {
  const { listener, data, message } = await setup();
  // call the on message function with the data object
  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
