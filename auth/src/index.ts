import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting...");
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY not defined");
  if (!process.env.MONGO_URI) throw new Error("Mongo URI must be defined");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongo");
  } catch (e) {
    console.log(e);
  }
  app.listen(3000, () => {
    console.log("Listening on 3000 - Moeed cheghad");
  });
};
start();
