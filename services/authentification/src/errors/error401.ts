import { Request, Response } from "express";

/**
 * Error 401 "Unauthorized"
 */
export default function error401(req: Request, res: Response, message = "Une authentification est requise") {
  res.status(401).json({
    code: 401,
    message
  });
}