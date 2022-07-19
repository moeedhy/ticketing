import request from "supertest";
import { app } from "../../app";

it("should return null for session and return empty", async function () {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "12345678" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);
  expect(response.get("Set-Cookie")[0].split(";")[0]).toEqual("session=");
});
