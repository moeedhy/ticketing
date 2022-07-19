import { Listener, Subjects, TicketCreatedEvent } from "@moeedpubtest/common";
import { Message, Stan } from "node-nats-streaming";
import Ticket from "../../models/ticket";

export class TicketCreateListener extends Listener<TicketCreatedEvent> {
  queueGroupName = "orders-service";
  readonly subject = Subjects.TicketCreated;
  constructor(client: Stan) {
    super(client);
  }
  async onMessage(parseData: TicketCreatedEvent["data"], event: Message) {
    console.log(parseData);

    const ticket = Ticket.build({
      id: parseData.id,
      title: parseData.title,
      price: parseData.price,
    });
    await ticket.save();

    event.ack();
  }
}
