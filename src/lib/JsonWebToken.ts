import { sign, verify } from "jsonwebtoken";

interface PayloadValue {
  role: "admin" | "owner" | "people";
  adminId?: string;
  ownerId?: string;
  peopleId?: string;
}

export function createToken(payload: PayloadValue) {
  return {
    access_token: sign(payload, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1d",
    }),
    refresh_token: sign(payload, process.env.JWT_SECRET_KEY!, {
      expiresIn: "30d",
    }),
  };
}

export function verifyToken(token: string): PayloadValue {
  return verify(token, process.env.JWT_SECRET_KEY!) as PayloadValue;
}
