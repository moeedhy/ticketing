import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    const user = User.build({ email: email, password: password });
    await user.save();
    const jwtData = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_KEY!
    );
    req.session = { jwt: jwtData };
    res.status(201).send(user);
  } catch (e) {
    next(e);
  }
};
