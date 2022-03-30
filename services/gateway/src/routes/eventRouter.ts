import * as express from "express";
import * as url from "url";
import axios from "axios";
import authRequired from "../middleware/authRequired";
import error405 from "../errors/error405";
import verifyEventOwner from "../middleware/verifyEventOwner";

const eventRouter = express.Router();

eventRouter.get("/", authRequired({ adminRequired: true }), async (req, res, next) => {
    const params = new url.URLSearchParams();

    if (req.query.participants) params.append("participants", req.query.participants as string);
    if (req.query.embedOwner) params.append("embedOwner", req.query.embedOwner as string);

    try {
        const response = await axios.get(`${process.env.API_MAIN_URL}/event`, { params });
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

eventRouter.delete("/", authRequired({ adminRequired: true }), async (req, res, next) => {
    const params = new url.URLSearchParams();

    if (req.query.forceDelete === "true") params.append("forceDelete", req.query.forceDelete as string);

    try {
        const response = await axios.delete(`${process.env.API_MAIN_URL}/event`, { params });
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
        const response = await axios.post(`${process.env.API_MAIN_URL}/event`, {...req.body, owner_id: res.locals.tokenData.id});

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

eventRouter.all("/", error405(["GET", "POST"]));

eventRouter.get("/:id", async (req, res, next) => {
    const params = new url.URLSearchParams();

    if (req.query.participants) params.append("participants", req.query.participants as string);
    if (req.query.embedOwner) params.append("embedOwner", req.query.embedOwner as string);

    try {
        const response = await axios.get(`${process.env.API_MAIN_URL}/event/${req.params.id}`, { params });

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

eventRouter.delete("/:id", authRequired(), verifyEventOwner , async (req, res, next) => {
    try {
        const response = await axios.delete(`${process.env.API_MAIN_URL}/event/${req.params.id}`);

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

eventRouter.all("/:id", error405(["GET", "DELETE"]));

eventRouter.get("/:id/participants", async (req, res, next) => {

    try {
        const response = await axios.get(`${process.env.API_MAIN_URL}/event/${req.params.id}/participants`);

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

eventRouter.post("/:id/join-event/auth", authRequired(), async (req, res, next) => {

    try {
        const response = await axios.post(`${process.env.API_MAIN_URL}/event/${req.params.id}/join-event`, {...req.body, user_id: res.locals.tokenData.id});

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

eventRouter.post("/:id/join-event", async (req, res, next) => {

    try {
        const response = await axios.post(`${process.env.API_MAIN_URL}/event/${req.params.id}/join-event`, req.body);

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

eventRouter.post("/:id/comment", authRequired(), async (req, res, next) => {

    try {
        const response = await axios.post(`${process.env.API_MAIN_URL}/event/${req.params.id}/comment`, {...req.body, user_id: res.locals.tokenData.id});

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


eventRouter.all("/:id/participants", error405(["GET"]));

eventRouter.get("/:id/comments", async (req, res, next) => {
    const params = new url.URLSearchParams();

    if (req.query.embedAuthor) params.append("embedAuthor", req.query.embedAuthor as string);

    try {
        const response = await axios.get(`${process.env.API_MAIN_URL}/event/${req.params.id}/comments`, { params });

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

eventRouter.post("/:id/comments", authRequired(), async (req, res, next) => {
    try {
        const response = await axios.post(`${process.env.API_MAIN_URL}/event/${req.params.id}/comments`, {...req.body, author_id: res.locals.tokenData.id});

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

eventRouter.all("/:id/comments", error405(["GET"]));

export default eventRouter;