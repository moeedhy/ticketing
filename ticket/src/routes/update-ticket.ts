import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import Ticket from "../models/ticket";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@moeedpubtest/common";
import mongoose from "mongoose";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.put(
  "/:id",
  requireAuth,
  [body("title").notEmpty(), body("price").isFloat({ gt: 0 })],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { title, price } = req.body;

      const updateTicket = await Ticket.findById(id);
      if (!updateTicket) throw new NotFoundError("ticket not found");
      if (updateTicket.orderId)
        throw new Error("Update failed , a ticket is reserving");
      updateTicket.set({
        title,
        price,
      });

      await updateTicket.save();

      await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: updateTicket._id,
        price: updateTicket.price,
        userId: updateTicket.userId,
        title: updateTicket.title,
        version: updateTicket.version,
      });
      res.status(200).send(updateTicket);
    } catch (e) {
      next(e);
    }
  }
);

export { router as updateTicket };
