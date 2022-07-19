import { Listener, OrderCancelledEvent, Subjects } from "@moeedpubtest/common";
import { Message, Stan } from "node-nats-streaming";
import Ticket from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = "ticket-service";
  constructor(client: Stan) {
    super(client);
  }
  async onMessage(parseData: OrderCancelledEvent["data"], event: Message) {
    const { ticket, id } = parseData;

    const ticketFounded = await Ticket.findOne({ _id: ticket.id, orderId: id });
    if (!ticketFounded) throw new Error("Ticket with this orderID not found");
    ticketFounded.set("orderId", undefined);
    await ticketFounded.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticketFounded._id,
      price: ticketFounded.price,
      title: ticketFounded.title,
      userId: ticketFounded.userId,
      orderId: ticketFounded.orderId,
      version: ticketFounded.version,
    });

    event.ack();
  }
}
