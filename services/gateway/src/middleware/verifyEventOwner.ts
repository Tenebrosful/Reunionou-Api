import axios from "axios";
import { NextFunction, Request, Response } from "express";
import error403 from "../errors/error403";
import error404 from "../errors/error404";
export default async function verifyEventOwner(req: Request, res: Response, next: NextFunction) {

  try {
    const response = await axios.get(`${process.env.API_MAIN_URL}/event/${req.params.id}`);

    if (!res.locals.tokenData?.isAdmin && response.data.owner_id && response.data.owner_id !== res.locals.tokenData.id) { error403(req, res); return; }

    next();
  } catch (error) {
    // @ts-ignore
    if (error.isAxiosError && error.response) { error404(req, res, `L'évènement ${req.params.id} n'existe pas`); return; }

    next(error);
  }

}