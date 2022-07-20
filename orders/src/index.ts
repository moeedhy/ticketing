import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreateListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";

const setup = async () => {
  console.log("starting order ...");
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

    new TicketCreateListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connecting to mongo for orders");
  } catch (e) {
    console.log(e);
  }
  app.listen(3000, () => console.log("orders server running on 3000"));
};

setup();
