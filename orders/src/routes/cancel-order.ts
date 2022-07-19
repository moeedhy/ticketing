import { Router } from "express";
import { NotFoundError, OrderStatus, requireAuth } from "@moeedpubtest/common";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.delete("/api/orders/:id", requireAuth, async (req, res, next) => {
  try {
    const orderID = req.params.id;
    const order = await Order.findById(orderID).populate("ticket");
    if (!order) throw new NotFoundError("order not found");
    if (order.userId !== req.currentUser!.id) throw new Error("Not authorized");
    order.status = OrderStatus.Cancelled;
    await order.save();
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order._id,
      ticket: {
        id: order.ticket._id,
      },
      version: order.version,
    });
    res.status(200).send(order);
  } catch (e) {
    next(e);
  }
});

export { router as cancelOrder };
