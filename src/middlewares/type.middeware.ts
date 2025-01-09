import { NextFunction, Request, Response } from "express";

import { StudentType } from "@prisma/client";

export class TypeMiddleware {
  public static validate(allowedTypes?: StudentType[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const type = req.authUser.type as StudentType;

      if (!allowedTypes) {
        return next();
      }

      if (type && !allowedTypes.includes(type)) {
        const typesJoin = allowedTypes.join(", ");
        const path = req.path.split("/")[1];
        res.status(400).json({
          ok: false,
          message: `Somente estudantes do tipos ${typesJoin} tem acesso ao enpoint ${path}`,
        });
      }

      return next();
    };
  }
}
