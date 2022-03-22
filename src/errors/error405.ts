import { Request, Response } from "express";

/**
 * Error 405 "Method Not Allowed"
 */
export default function error405(allowedMethod: method[]) {
  return (req: Request, res: Response) => {
    res
      .set("Allow", allowedMethod.join(", "))
      .status(405).json({
        code: 405,
        message: "Méthode non-autorisée"
      });
  };
}

type method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";