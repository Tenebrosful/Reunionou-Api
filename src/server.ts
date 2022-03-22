import * as express from "express";
import { initBDD } from "../database/database";

import * as bodyParser from "body-parser";
import logger from "./middleware/logger";

import userRouter from "./routes/user";

import error400 from "./errors/error400";
import error500 from "./errors/error500";

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

initBDD();

app.use(logger);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Routes
 */
app.use("/api/user", userRouter);

/**
 * Handle Errors
 */

app.use(error400);
app.use(error500); // Must be on last position

app.listen(port, () => {
    console.log(`Server started at port http://localhost:${port}`);
});
