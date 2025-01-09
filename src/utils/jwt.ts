import jwt from "jsonwebtoken";
import { AuthStudent } from "../types/auth-student.type";

export class JWT {
  public generateToken(data: AuthStudent): string {
    if (!process.env.JWT_SECRET) {
      throw new Error("Secret not defined");
    }

    const token = jwt.sign(data, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
  }

  public verifyToken(token: string): AuthStudent | null {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("Secret not defined");
      }

      const data = jwt.verify(token, process.env.JWT_SECRET) as AuthStudent;
      return data;
    } catch {
      return null;
    }
  }
}
