import * as express from "express";
import * as cors from "cors";
import { initBDD } from "../../../databases/main/database";

import * as bodyParser from "body-parser";
import logger from "./middleware/logger";

import userRouter from "./routes/userRouter";
import eventRouter from "./routes/eventRouter";

import error400 from "./errors/error400";
import error500 from "./errors/error500";

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

initBDD();

app.use(cors());
app.use(logger);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Routes
 */
app.all("/", (req, res) => {
    res.status(200).send("It Works ! (Cependant attention, la base de l'url est /api et non /)");
});
app.all("/api", (req, res) => {
    res.status(200).send("It Works !");
});
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);

/**
 * Handle Errors
 */

app.use(error400);
app.use(error500); // Must be on last position

app.listen(port, () => {
    console.log(`Server started at port http://localhost:${port}`);
});
