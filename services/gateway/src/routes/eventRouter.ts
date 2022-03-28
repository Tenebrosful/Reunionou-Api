import express = require("express");
import axios from "axios";
import authRequired from "../middleware/authRequired";

const eventRouter = express.Router();

eventRouter.post('/', authRequired(), async (req, res, next) => {
    try {
        const response = await axios.post(process.env.API_MAIN_URL + '/event/', req.body);

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

eventRouter.get("/:id", async (req, res, next) => {
    
    try {
        const response = await axios.get(process.env.API_MAIN_URL + '/event/' + req.params.id);

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

eventRouter.get("/:id/participants", async (req, res, next) => {
    
    try {
        const response = await axios.get(process.env.API_MAIN_URL + '/event/' + req.params.id + '/participants');

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

eventRouter.get("/:id/comments", async (req, res, next) => {
    let option = '';

    if (req.query.embedAuthor) option = '?embedAuthor=true';

    try {
        const response = await axios.get(process.env.API_MAIN_URL + '/event/' + req.params.id + '/comments' + option);

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

export default eventRouter;