import { NextFunction, Request, Response, Router } from "express";
import Ticket from "../models/ticket";
import {NotFoundError} from "@moeedpubtest/common";

const router = Router();

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticketId = req.params.id;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError('user not found');
    res.status(200).send(ticket);
  }catch (e) {
    next(e);
  }
});

export { router as getTicket };
