import axios from "axios";
import * as url from "url";
import * as express from "express";
import error405 from "../errors/error405";
import authRequired from "../middleware/authRequired";
const userRouter = express.Router();

userRouter.get("/", authRequired({ adminRequired: true }), async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.API_MAIN_URL}/user`);
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

userRouter.all("/", error405(["GET"]));

userRouter.get("/:id", authRequired({ selfUserIdRequired: true }), async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.API_MAIN_URL}/user/${req.params.id}`);
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

userRouter.all("/:id", error405(["GET"]));

userRouter.get("/:id/joined-event", async (req, res, next) => {
  const params = new url.URLSearchParams();

  if (req.query.participants) params.append("participants", req.query.participants as string);
  if (req.query.embedOwner) params.append("embedOwner", req.query.embedOwner as string);

  try {
    const response = await axios.get(`${process.env.API_MAIN_URL}/user/${req.params.id}/joined-event`, { params });
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

userRouter.all("/:id/joined-event", error405(["GET"]));

export default userRouter;