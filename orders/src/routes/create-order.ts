import { NextFunction, Request, Response, Router } from "express";
import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@moeedpubtest/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import Ticket from "../models/ticket";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
  "/api/orders/",
  requireAuth,
  [body("ticketId").notEmpty().withMessage("Ticket Id not provided")],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ticketId } = req.body;

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) throw new NotFoundError("ticket not found");

      const checkTicketReserved = await ticket.isReserved();
      if (checkTicketReserved) throw new Error("Ticket was reserved before");

      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 15);
      const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        ticket: ticket._id,
        expiredAt: expiration,
      });
      await order.save();

      await new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order._id,
        status: order.status,
        expiredAt: order.expiredAt.toISOString(),
        userId: order.userId,
        ticket: {
          id: ticket._id,
          price: ticket.price,
        },
        version: order.version,
      });

      res.status(201).send(order);
    } catch (e) {
      next(e);
    }
  }
);

export { router as createOrder };
