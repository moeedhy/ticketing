import { OrderCancelledEvent, Publisher, Subjects } from "@moeedpubtest/common";
import { Stan } from "node-nats-streaming";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  constructor(client: Stan) {
    super(client);
  }
  readonly subject = Subjects.OrderCancelled;
}
