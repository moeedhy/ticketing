import request from "supertest";
import { app } from "../../app";

it("should return 200 when call GET /api/tickets/", async function () {
  await request(app).get("/api/tickets").expect(200);
});
it("should return array of tickets ", async function () {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "ticket", price: 235 })
    .expect(201);
  const response = await request(app).get("/api/tickets").expect(200);
  expect(response.body[0]).toBeDefined();
});
