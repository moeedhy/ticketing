import { Publisher, Subjects, TicketCreatedEvent } from "@moeedpubtest/common";
import { Stan } from "node-nats-streaming";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  constructor(client: Stan) {
    super(client);
  }
  readonly subject = Subjects.TicketCreated;
}
