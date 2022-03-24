import { Request, Response } from "express";

/**
 * Error 403 "Forbidden"
 */
export default function error403(req: Request, res: Response) {
  res.status(403).json({
    code: 403,
    message: "Accès interdit"
  });
}