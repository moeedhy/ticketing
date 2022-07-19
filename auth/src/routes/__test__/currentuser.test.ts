import request from "supertest";
import { app } from "../../app";

it("should responde with details about currentuser", async function () {
  const cookie = await signin();
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .set("Cookie", cookie)
    .expect(200);
  expect(response.body.currentUser).toBeDefined();
  expect(response.body.currentUser.email).toEqual("test@test.com");
});
it("should throww an err when user not signin", async function () {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(400);
  expect(response.body.currentUser).not.toBeDefined();
});
