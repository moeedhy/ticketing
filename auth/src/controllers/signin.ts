import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { NotFoundError } from "@moeedpubtest/common";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) throw new NotFoundError("User not founded");
    const decodePass = await bcrypt.compare(password, user.password);
    if (!decodePass) throw new Error("Username or password is incorrect!!");

    const jwtUser = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_KEY!
    );
    req.session = { jwt: jwtUser };
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

export default signInController;
