import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

export const generateToken = (user: IUser) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      tenantId: user.tenantId?.toString(),
      role: user.role
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
      issuer: "orbitpm",
      audience: "orbitpm-users"
    }
  );
};
