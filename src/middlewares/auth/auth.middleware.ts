import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services";
import { JWT } from "../../utils/jwt";

export class AuthMiddleware {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        ok: false,
        message: "Não autenticado!",
      });
      return;
    }

    const [, token] = authorization.split(" ");

    const jwt = new JWT();
    const payload = jwt.verifyToken(token);

    if (!payload) {
      res.status(401).json({
        ok: false,
        message: "Não autenticado!",
      });
      return;
    }

    req.authUser = payload;

    next();
  }
}
