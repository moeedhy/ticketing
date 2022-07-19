import express from "express";
import currentUserController from "../controllers/current-user";
import { currentUser } from "@moeedpubtest/common";
import { requireAuth } from "@moeedpubtest/common";

const router = express.Router();

router.get("/currentuser", currentUser, currentUserController);

export { router as currentUserRouter };
