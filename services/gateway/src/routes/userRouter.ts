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

userRouter.delete("/", authRequired({ adminRequired: true }), async (req, res, next) => {
  const params = new url.URLSearchParams();

  if (req.query.forceDelete) params.append("forceDelete", req.query.forceDelete as string);

  try {
    await axios.delete(`${process.env.API_MAIN_URL}/user`);
    await axios.delete(`${process.env.API_AUTH_URL}/user`, { params });
    res.status(204).send();
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

userRouter.get("/account", authRequired({ adminRequired: true }), async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.API_AUTH_URL}/user`);
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

userRouter.all("/account", error405(["GET"]));

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

userRouter.delete("/:id", authRequired({ selfUserIdRequired: true }), async (req, res, next) => {
  const params = new url.URLSearchParams();

  if (req.query.forceDelete) params.append("forceDelete", req.query.forceDelete as string);

  try {
    const response = await axios.delete(`${process.env.API_AUTH_URL}/user/${req.params.id}`, { params });
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

userRouter.patch("/:id", authRequired({ selfUserIdRequired: true }), async (req, res, next) => {
  try {
    let responseAuth, responseMain;

    if (req.body.login || req.body.password)
      responseAuth = await axios.patch(`${process.env.API_AUTH_URL}/user/${req.params.id}`, req.body);

    if (req.body.default_mail || req.body.profile_image_url || req.body.username)
      responseMain = await axios.patch(`${process.env.API_MAIN_URL}/user/${req.params.id}`, req.body);

    if (!responseMain && !responseAuth) throw new Error("No data to update");

    if ((responseAuth && responseAuth.status === 204) && (responseMain && responseMain.status === 204)
      || (!responseAuth && responseMain && responseMain.status === 204) || (!responseMain && responseAuth && responseAuth.status === 204)) { res.status(204).send(); return; }

    res.status(500).send();
  } catch (e) {

    // @ts-ignore
    if (e.isAxiosError && e.response && e.response.status !== 500) {
      // @ts-ignore
      res.status(e.response.status).json(e.response.data); return;
    }

    next(e);
  }
});

userRouter.all("/:id", error405(["GET", "DELETE"]));

userRouter.get("/:id/account", authRequired({ selfUserIdRequired: true }), async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.API_AUTH_URL}/user/${req.params.id}`);
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

userRouter.all("/:id/account", error405(["GET"]));

userRouter.post("/:id/restore", authRequired({ selfUserIdRequired: true }), async (req, res, next) => {
  try {
    const response = await axios.post(`${process.env.API_AUTH_URL}/user/${req.params.id}/restore`);
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

userRouter.all("/:id/restore", error405(["POST"]));

userRouter.get("/:id/joined-event", authRequired({ selfUserIdRequired: true }), async (req, res, next) => {
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

userRouter.get("/:id/self-event", authRequired({ selfUserIdRequired: true }), async (req, res, next) => {
  const params = new url.URLSearchParams();

  if (req.query.participants) params.append("participants", req.query.participants as string);
  if (req.query.embedOwner) params.append("embedOwner", req.query.embedOwner as string);

  try {
    const response = await axios.get(`${process.env.API_MAIN_URL}/user/${req.params.id}/self-event`, { params });
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

userRouter.all("/:id/self-event", error405(["GET"]));

export default userRouter;