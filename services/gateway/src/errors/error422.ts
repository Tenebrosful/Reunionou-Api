import { Request, Response } from "express";

/**
 * Error 422 "Unprocessable Entity"
 */
export default function error422(req: Request, res: Response, message = "Traitement impossible") {
  res.status(422).json({
    code: 422,
    message
  });
}