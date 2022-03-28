import axios from "axios";
import * as express from "express";
import * as url from "url";
import authRequired from "../middleware/authRequired";
import error405 from "../errors/error405";
const commentRouter = express.Router();

commentRouter.get("/", authRequired({ adminRequired: true }), async (req, res, next) => {
  const params = new url.URLSearchParams();

  if (req.query.embedAuthor) params.append("embedAuthor", req.query.embedAuthor as string);
  if (req.query.embedEvent) params.append("embedEvent", req.query.embedEvent as string);
  if (req.query.participants) params.append("participants", req.query.participants as string);

  try {
    const response = await axios.get(`${process.env.API_MAIN_URL}/comment`, { params });
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

commentRouter.all("/", error405(["GET"]));

export default commentRouter;