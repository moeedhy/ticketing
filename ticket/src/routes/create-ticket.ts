import { NextFunction, Request, Response, Router } from "express";
import {
  RequestValidationError,
  requireAuth,
  validateRequest,
} from "@moeedpubtest/common";
import { body, validationResult } from "express-validator";
import Ticket from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
  "/",
  requireAuth,
  [
    body("title").notEmpty().withMessage("title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("price is negative"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;
    const userId = req.currentUser!.id;
    const newTicket = Ticket.build({ title, price, userId });
    await newTicket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      title: newTicket.title,
      id: newTicket.id,
      price: newTicket.price,
      userId: userId,
      version: newTicket.version,
    });
    res.status(201).send(newTicket);
  }
);

export { router as createTicket };
