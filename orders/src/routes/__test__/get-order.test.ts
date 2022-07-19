import Ticket from "../../models/ticket";
import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@moeedpubtest/common";

it("should return 200 and order ", async function () {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 222,
    title: "hey you",
  });
  await ticket.save();
  const { body } = await request(app)
    .post("/api/orders/")
    .set("Cookie", signin())
    .send({ ticketId: ticket._id })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${body.id}`)
    .set("Cookie", signin())
    .send()
    .expect(200);
  expect(response.body.id).toEqual(body.id);
});

it("should return 404 if order id not found ", async function () {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 222,
    title: "hey you",
  });
  await ticket.save();
  await request(app)
    .post("/api/orders/")
    .set("Cookie", signin())
    .send({ ticketId: ticket._id })
    .expect(201);
  const orderId = new mongoose.Types.ObjectId().toString();
  await request(app)
    .get(`/api/orders/${orderId}`)
    .set("Cookie", signin())
    .send()
    .expect(404);
});
it("should return 400 if user id not equal to current user", async function () {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 222,
    title: "hey you",
  });
  await ticket.save();
  const order = Order.build({
    userId: "asdasd",
    ticket,
    status: OrderStatus.Created,
    expiredAt: new Date(),
  });
  await order.save();
  await request(app)
    .get(`/api/orders/${order._id}`)
    .set("Cookie", signin())
    .send()
    .expect(400);
});
