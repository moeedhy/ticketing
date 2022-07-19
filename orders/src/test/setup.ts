import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}
jest.mock("../nats-wrapper");
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "secret";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  collections.forEach((collection) => collection.deleteMany({}));
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  const fakeData = {
    email: "test@test.com",
    id: "1",
  };
  const token = jwt.sign(fakeData, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionStringify = JSON.stringify(session);
  const base64 = Buffer.from(sessionStringify).toString("base64");
  return [`session=${base64}`];
};
