import request from "supertest";
import { app } from "../../app";

it("return 400 if password was incorrect", async () => {
  await signin();
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "1234567" })
    .expect(400);
});

it("return 422 if inputes not valid", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "testtest.com", password: "12345678" })
    .expect(422);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com" })
    .expect(422);

  await request(app)
    .post("/api/users/signin")
    .send({ password: "12345678" })
    .expect(422);
});

it("should set cookie be defined", async function () {
  await signin();
  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "12345678" })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
