import request from "supertest";
import { app } from "../../app";
import Ticket from "../../models/ticket";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("should throw an error if ticketId is not valid", async function () {
  await request(app)
    .post("/api/orders/")
    .set("Cookie", signin())
    .send()
    .expect(422);
});
it("should throw an error if ticketId is not found", async function () {
  const ticketId = new mongoose.Types.ObjectId().toString();
  await request(app)
    .post("/api/orders/")
    .set("Cookie", signin())
    .send({ ticketId: ticketId })
    .expect(404);
});

it("should return 400 if order was reserved before", async function () {
  const ticket = Ticket.build({
    price: 222,
    title: "hey you",
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  await request(app)
    .post("/api/orders/")
    .set("Cookie", signin())
    .send({ ticketId: ticket._id })
    .expect(201);
  await request(app)
    .post("/api/orders/")
    .set("Cookie", signin())
    .send({ ticketId: ticket._id })
    .expect(400);
});

it("should return 201 if order was created", async function () {
  const ticket = Ticket.build({
    price: 222,
    title: "hey you",
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  await request(app)
    .post("/api/orders/")
    .set("Cookie", signin())
    .send({ ticketId: ticket._id })
    .expect(201);
});

it("should emmit an event order:created ", async function () {
  const ticket = Ticket.build({
    price: 222,
    title: "hey you",
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  const response = await request(app)
    .post("/api/orders/")
    .set("Cookie", signin())
    .send({ ticketId: ticket._id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
