import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import * as jwt from "jsonwebtoken";
import error401 from '../errors/error401';
import error403 from '../errors/error403';
export default function authRequired(options: { adminRequired?: boolean, userId?: string } = { adminRequired: false, userId: undefined }) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.headers["authorization"]) { error401(req, res, "Header 'Autorization' requis"); return; }

        console.log(options);

        res.locals.token = req.headers["authorization"];

        try {
            await axios.post(`${process.env.API_AUTH_URL}/auth/tokenVerify`, {}, { headers: { authorization: "" + res.locals.token } });

            const tokenData = jwt.decode(res.locals.token);

            // @ts-ignore
            if (options.adminRequired && !tokenData?.isAdmin) error403(req, res);

            // @ts-ignore
            if (!tokenData?.isAdmin && options.userId && options.userId !== tokenData?.userId) { error403(req, res); return; }

            next();
        } catch (error) {
            // @ts-ignore
            if (error.isAxiosError && error.response) { error403(req, res); return; }

            next(error);
        }

    };
}