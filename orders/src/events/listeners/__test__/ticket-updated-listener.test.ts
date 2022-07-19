import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@moeedpubtest/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import Ticket from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 222,
    title: "Old Ticket",
  });
  await ticket.save();
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    title: "ticket new",
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 333,
    id: ticket._id,
    version: 1,
  };
  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };
  return { listener, data, message, ticket };
};
it("should update version , data and saves a ticket", async function () {
  const { listener, data, message } = await setup();
  // call the on message function with the data object
  await listener.onMessage(data, message);
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.version).toEqual(1);
});

it("should ack the message", async function () {
  const { listener, data, message } = await setup();
  // call the on message function with the data object
  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
it("should not ack the message if event has a skipped version", async function () {
  const { listener, data, message, ticket } = await setup();
  // call the on message function with the data object;
  data.version = 3;
  try {
    await listener.onMessage(data, message);
  } catch (e) {}
  expect(message.ack).not.toHaveBeenCalled();
});
