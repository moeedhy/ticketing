import { NextFunction, Request, Response, Router } from "express";
import Ticket from "../models/ticket";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets = await Ticket.find({});
    res.status(200).send(tickets);
  } catch (e) {
    next(e);
  }
});

export { router as ticketList };
