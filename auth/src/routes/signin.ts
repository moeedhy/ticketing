import express from "express";
import { body } from "express-validator";
import signInController from "../controllers/signin";
import { validateRequest } from "@moeedpubtest/common";

const router = express.Router();

router.post(
  "/signin",
  [
    body("email").trim().isEmail().normalizeEmail(),
    body("password").trim().notEmpty(),
  ],
  validateRequest,
  signInController
);

export { router as signInRouter };
