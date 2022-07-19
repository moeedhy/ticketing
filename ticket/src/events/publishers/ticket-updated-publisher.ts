import { Publisher, Subjects, TicketUpdatedEvent } from "@moeedpubtest/common";
import { Stan } from "node-nats-streaming";
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  constructor(client: Stan) {
    super(client);
  }
  readonly subject = Subjects.TicketUpdated;
}
