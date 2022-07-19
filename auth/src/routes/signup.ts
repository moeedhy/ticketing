import express from "express";
import { body } from "express-validator";

import { signUpController } from "../controllers/signup";
import User from "../models/user";
import { validateRequest } from "@moeedpubtest/common";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("email is not valid")
      .normalizeEmail(),
    body("password")
      .trim()
      .isAlphanumeric()
      .isLength({ min: 8 })
      .withMessage("password must be 8 character least"),
    body("email").custom(async (input) => {
      const userFind = await User.findOne({ email: input });
      if (userFind) return Promise.reject("User with this email is existed ");
    }),
  ],
  validateRequest,
  signUpController
);

export { router as signUpRouter };
