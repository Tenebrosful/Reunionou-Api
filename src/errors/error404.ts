import { Request, Response } from "express";

/**
 * Error 404 "Not Found"
 */
export default function error404(req: Request, res: Response, message = "Ressource introuvable") {
  res.status(404).json({
    code: 404,
    message
  });
}