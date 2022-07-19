import { Router } from "express";
import { requireAuth } from "@moeedpubtest/common";
import { Order } from "../models/order";

const router = Router();

router.get("/api/orders/", requireAuth, async (req, res, next) => {
  const userId = req.currentUser!.id;

  const orders = await Order.find({ userId }).populate("ticket");

  res.status(200).send({ orders });
});

export { router as getOrderList };
