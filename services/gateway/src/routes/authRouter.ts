import * as express from "express";

import axios from "axios";

const authRouter = express.Router();

authRouter.post('/inscription', async (req, res, next) => {
    try {
        const response = await axios.post(process.env.API_AUTH_URL + '/inscription', req.body);

        res.status(response.status).json(response.data);
    } catch (e) {
        
        // @ts-ignore
        if(e.isAxiosError && e.response && e.response.status !== 500) {
            // @ts-ignore
            res.status(e.response.status).json(e.response.data); return;
        }

        next(e);
    }
});

authRouter.post('/', async (req, res, next) => {
    try {
        const response = await axios.post(process.env.API_AUTH_URL + '/auth', req.body);
        
        res.status(response.status).json(response.data);
    } catch (e) {
        
        // @ts-ignore
        if(e.isAxiosError && e.response && e.response.status !== 500) {
            // @ts-ignore
            res.status(e.response.status).json(e.response.data); return;
        }

        next(e);
    }
});

export default authRouter;