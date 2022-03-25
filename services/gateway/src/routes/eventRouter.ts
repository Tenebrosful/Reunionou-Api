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

export default eventRouter;