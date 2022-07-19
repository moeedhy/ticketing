import request from "supertest";
import { app } from "../../app";

it("return a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "57448588" })
    .expect(201);
});

it("return a 422 if email was wrong", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test.test.com", password: "password" })
    .expect(422);
});

it("return a 422 if invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "12345" })
    .expect(422);
});

it("return a 422 if missing email or password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com" })
    .expect(422);
  await request(app)
    .post("/api/users/signup")
    .send({ password: "12345678" })
    .expect(422);
});

it("disallow duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "12345678" })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "123456789" })
    .expect(422);
});

it("set cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "12345678" })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
  console.log(response.get("Set-Cookie"));
});
