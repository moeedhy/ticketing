import request from "supertest";
import Ticket from "../../models/ticket";
import { app } from "../../app";
import mongoose from "mongoose";

it("should return 200 and array of user's orders list ", async function () {
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
  const response = await request(app)
    .get("/api/orders/")
    .set("Cookie", signin())
    .send()
    .expect(200);
  expect(response.body.orders.length).toEqual(1);
});
