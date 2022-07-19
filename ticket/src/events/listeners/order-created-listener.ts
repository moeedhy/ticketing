import { Listener, OrderCreatedEvent, Subjects } from "@moeedpubtest/common";
import { Message, Stan } from "node-nats-streaming";
import Ticket from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = "ticket-service";
  constructor(client: Stan) {
    super(client);
  }
  async onMessage(parseData: OrderCreatedEvent["data"], event: Message) {
    const { ticket, id } = parseData;
    const ticketExists = await Ticket.findById(ticket.id);
    if (!ticketExists) throw new Error("Ticket not founded");
    ticketExists.set("orderId", id);
    await ticketExists.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticketExists._id,
      version: ticketExists.version,
      userId: ticketExists.userId,
      price: ticketExists.price,
      title: ticketExists.title,
      orderId: ticketExists.orderId,
    });

    event.ack();
  }
}
