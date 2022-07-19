import { Request, Response } from "express";

const currentUserController = (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
};

export default currentUserController;
