import * as express from "express";
import { User } from "../../../../databases/main/models/User";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import error422 from "../errors/error422";
import error501 from "../errors/error501";

const authRouter = express.Router();

export default authRouter;