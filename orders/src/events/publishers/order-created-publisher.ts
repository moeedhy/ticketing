import { OrderCreatedEvent, Publisher, Subjects } from "@moeedpubtest/common";
import { Stan } from "node-nats-streaming";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  constructor(client: Stan) {
    super(client);
  }
  readonly subject = Subjects.OrderCreated;
}
