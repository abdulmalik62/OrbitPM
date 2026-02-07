import jwt from "jsonwebtoken";

export interface JwtPayload {
  sub: string;
  tenantId?: string;
  role: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string, {
    issuer: "orbitpm",
    audience: "orbitpm-users"
  }) as JwtPayload;
};
