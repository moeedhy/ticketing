import { Router } from "express";
import { NotFoundError, requireAuth } from "@moeedpubtest/common";
import { Order } from "../models/order";

const router = Router();

router.get("/api/orders/:id", requireAuth, async (req, res, next) => {
  try {
    const ticketId = req.params.id;
    const order = await Order.findById(ticketId).populate("ticket");
    if (!order) throw new NotFoundError("ticket not found");
    if (order.userId !== req.currentUser!.id) throw new Error("auth error");
    res.status(200).send(order);
  } catch (e) {
    next(e);
  }
});

export { router as getOrder };
