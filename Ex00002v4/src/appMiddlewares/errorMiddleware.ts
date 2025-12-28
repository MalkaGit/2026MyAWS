//8.1
//errorMiddleware 
//Rsponisibilities:   Handles service errors for all controllers
//not agnostic:       tied to fw (express), not agnostic
import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  //ConflictError,
} from "../domainErrors/domainErrors";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof BadRequestError)
    return res.status(400).json({ message: err.message });

  if (err instanceof NotFoundError)
    return res.status(404).json({ message: err.message });

  if (err instanceof ForbiddenError)
    return res.status(403).json({ message: err.message });

  //if (err instanceof ConflictError)
  //  return res.status(409).json({ message: err.message });

  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
}
