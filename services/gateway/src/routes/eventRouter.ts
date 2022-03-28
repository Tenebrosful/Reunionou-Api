import * as express from "express";
import * as url from "url";
import axios from "axios";
import authRequired from "../middleware/authRequired";
import error405 from "../errors/error405";

const eventRouter = express.Router();

eventRouter.get("/", authRequired({ adminRequired: true }), async (req, res, next) => {
    try {
        const response = await axios.get(`${process.env.API_MAIN_URL}/event`);
        res.status(response.status).json(response.data);
    } catch (e) {

        // @ts-ignore
        if (e.isAxiosError && e.response && e.response.status !== 500) {
            // @ts-ignore
            res.status(e.response.status).json(e.response.data); return;
        }

        next(e);
    }
});

eventRouter.post('/', authRequired(), async (req, res, next) => {
    try {
        const response = await axios.post(`${process.env.API_MAIN_URL}/event`, req.body);

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

eventRouter.all("/", error405(["GET", "POST"]));

eventRouter.get("/:id", async (req, res, next) => {
    
    try {
        const response = await axios.get(`${process.env.API_MAIN_URL}/event/${req.params.id}`);

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

eventRouter.all("/:id", error405(["GET"]));

eventRouter.get("/:id/participants", async (req, res, next) => {
    
    try {
        const response = await axios.get(`${process.env.API_MAIN_URL}/event/${req.params.id}/participants`);

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

eventRouter.all("/:id/participants", error405(["GET"]));

eventRouter.get("/:id/comments", async (req, res, next) => {
    const params = new url.URLSearchParams();

    if (req.query.embedAuthor) params.append("embedAuthor", req.query.embedAuthor as string);

    try {
        const response = await axios.get(`${process.env.API_MAIN_URL}/event/${req.params.id}/comments`, { params });

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

eventRouter.all("/:id/comments", error405(["GET"]));

export default eventRouter;