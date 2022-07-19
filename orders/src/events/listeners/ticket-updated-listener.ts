import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@moeedpubtest/common";
import { Message, Stan } from "node-nats-streaming";
import Ticket from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  queueGroupName = "orders-service";
  readonly subject = Subjects.TicketUpdated;
  constructor(client: Stan) {
    super(client);
  }
  async onMessage(parseData: TicketUpdatedEvent["data"], event: Message) {
    console.log(parseData);
    const ticket = await Ticket.findOne({
      _id: parseData.id,
      version: parseData.version - 1,
    });
    if (!ticket) throw new Error("Ticket not founded");

    const { title, price } = parseData;
    ticket.set({ title, price });
    await ticket.save();
    event.ack();
  }
}
