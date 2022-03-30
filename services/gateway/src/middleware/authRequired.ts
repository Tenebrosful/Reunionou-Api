import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import * as jwt from "jsonwebtoken";
import error401 from '../errors/error401';
import error403 from '../errors/error403';
export default function authRequired(options: { adminRequired?: boolean, selfUserIdRequired?: boolean } = { adminRequired: false, selfUserIdRequired: false }) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.headers["authorization"]) { error401(req, res, "Header 'Autorization' requis"); return; }

        res.locals.token = req.headers["authorization"];

        try {
            await axios.post(`${process.env.API_AUTH_URL}/auth/tokenVerify`, {}, { headers: { authorization: "" + res.locals.token } });

            res.locals.tokenData = jwt.decode(res.locals.token);

            if (options.adminRequired && !res.locals.tokenData?.isAdmin) { error403(req, res); return; }

            if (!res.locals.tokenData?.isAdmin && options.selfUserIdRequired && req.params.id !== res.locals.tokenData.id) { error403(req, res); return; }

            next();
        } catch (error) {
            // @ts-ignore
            if (error.isAxiosError && error.response) { error403(req, res); return; }

            next(error);
        }

    };
}