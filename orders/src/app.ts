import express from "express";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@moeedpubtest/common";
import { getOrder } from "./routes/get-order";
import { getOrderList } from "./routes/get-orders-list";
import { createOrder } from "./routes/create-order";
import { cancelOrder } from "./routes/cancel-order";
const app = express();

app.use(express.json());
app.set("trust proxy", true);

app.use(
  cookieSession({
    secure: process.env.NODE_ENV === "test" || true,
    signed: false,
  })
);

app.use(currentUser);

app.use(getOrder, getOrderList, createOrder, cancelOrder);
app.use("/*", () => {
  throw NotFoundError;
});

app.use(errorHandler);

export { app };
