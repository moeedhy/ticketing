import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return 404 if the ticket is not found", async function () {
  const id = new mongoose.Types.ObjectId().toString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send()
    .expect(404);
});
it("should returns the ticket if the ticket is found", async function () {
  const response = await request(app)
    .post("/api/tickets/")
    .set("Cookie", signin())
    .send({ title: "hey you test", price: 222 });
  expect(response.body.id).toBeDefined();
  await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);
});
