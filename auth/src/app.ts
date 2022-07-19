import express from "express";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signUpRouter } from "./routes/signup";
import { signOutRouter } from "./routes/signout";
import { errorHandler } from "@moeedpubtest/common";
import { NotFoundError } from "@moeedpubtest/common";
import cookieSession from "cookie-session";
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(
  "/api/users/",
  currentUserRouter,
  signInRouter,
  signUpRouter,
  signOutRouter
);
app.get("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
