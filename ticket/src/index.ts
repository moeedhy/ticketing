import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const setup = async () => {
  console.log("Starting ticket ...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY Must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not set");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("Cluster ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("Client ID must be defined");
  }
  if (!process.env.NATS_URI) {
    throw new Error("NATS_URI must be defined");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connecting to mongo for ticket");
  } catch (e) {
    console.log(e);
  }
  app.listen(3000, () => console.log("ticket server running on 3000"));
};

setup();
