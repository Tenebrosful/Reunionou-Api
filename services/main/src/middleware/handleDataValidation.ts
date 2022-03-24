import { Request, Response } from "express";
import { ObjectSchema } from "joi";
import error422 from "../errors/error422";

export default function handleDataValidation(validationSchema: ObjectSchema, data: any, req: Request, res: Response, allRequired = false) { // eslint-disable-line
  const { error: validationError } = validationSchema.validate(data, {
    presence: (allRequired ? "required" : "optional"), 
  });

  if (validationError) {
    error422(req, res, validationError.details.map(details => details.message).join(", ").replaceAll("\"", "'"));
    return false;
  }

  return true;
}