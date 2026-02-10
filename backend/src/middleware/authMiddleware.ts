import { Request, Response } from "express";
import { verifyToken } from "../utils/verifyToken";

export const buildContext = ({ req }: { req: Request }) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return {};

  const token = authHeader.replace("Bearer ", "");

  try {
    const user = verifyToken(token);
    return { user };
  } catch (error) {
    return {};
  }
};
