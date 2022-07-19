import express from "express";
import { currentUser, errorHandler, NotFoundError } from "@moeedpubtest/common";
import cookieSession from "cookie-session";
import { createTicket } from "./routes/create-ticket";
import { ticketList } from "./routes/tickets-list";
import { getTicket } from "./routes/get-ticket";
import { updateTicket } from "./routes/update-ticket";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

// Routes
app.use("/api/tickets", ticketList, createTicket, updateTicket, getTicket);

app.get("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
