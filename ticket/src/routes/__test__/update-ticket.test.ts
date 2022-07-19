import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("should throw an error 422 if input value not tru", async function () {
  const id = new mongoose.Types.ObjectId().toString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ price: 236 })
    .expect(422);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ price: -236 })
    .expect(422);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ title: "moeed" })
    .expect(422);
});

it("should throw an error 404 if ticket id is wrong", async function () {
  const id = new mongoose.Types.ObjectId().toString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ title: "test", price: 236 })
    .expect(404);
});

it("should throw an error 400 if user not authenticated", async function () {
  const id = new mongoose.Types.ObjectId().toString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "test", price: 236 })
    .expect(400);
});

it("should return 201 and update ticket", async function () {
  const ticket = await request(app)
    .post("/api/tickets/")
    .set("Cookie", signin())
    .send({ title: "hey you test", price: 222 })
    .expect(201);

  const response = await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", signin())
    .send({ title: "test", price: 236 })
    .expect(200);

  expect(response.body.title).toEqual("test");
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
