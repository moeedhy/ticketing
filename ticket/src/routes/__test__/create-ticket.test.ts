import request from "supertest";
import { app } from "../../app";
import Ticket from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler for listening to /api/tickets for post request", async function () {
  const response = await request(app).post("/api/tickets/").send({});
  expect(response.status).not.toEqual(404);
});

it("can only accessed if the user is signed in", async function () {
  await request(app).post("/api/tickets/").send({}).expect(400);

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({});

  expect(response.status).not.toEqual(400);
});

it("should throw an err if title is missing or invalid", async function () {
  const cookie = signin();
  await request(app)
    .post("/api/tickets/")
    .set("Cookie", cookie)
    .send({ price: 222 })
    .expect(422);
});

it("should throw an err if price is missing or invalid", async function () {
  const cookie = signin();
  await request(app)
    .post("/api/tickets/")
    .set("Cookie", cookie)
    .send({ title: "concert" })
    .expect(422);

  await request(app)
    .post("/api/tickets/")
    .set("Cookie", cookie)
    .send({ title: "concert", price: "222a" })
    .expect(422);

  await request(app)
    .post("/api/tickets/")
    .set("Cookie", cookie)
    .send({ title: "concert", price: -10 })
    .expect(422);
});

it("should retun 201 and create a event", async function () {
  const title = "consert";
  let ticket = await Ticket.find({});
  expect(ticket.length).toEqual(0);
  const cookie = signin();
  const response = await request(app)
    .post("/api/tickets/")
    .set("Cookie", cookie)
    .send({ title, price: 222 })
    .expect(201);
  ticket = await Ticket.find({});
  expect(ticket.length).toEqual(1);
  expect(ticket[0].title).toEqual(title);
  expect(ticket[0].price).toEqual(222);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
