import axios from "axios";
import * as express from "express";
import { UserAccount } from "../../../../databases/authentification/models/UserAccount";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import error422 from "../errors/error422";
import { iAllUserAccount, iUserAccount } from "../responseInterface/userResponse";
const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  try {
    const { count, rows: users } = await UserAccount.findAndCountAll(
      {
        attributes: ["id", "login", "isAdmin", "last_connexion", "createdAt", "updatedAt"]
      }
    );

    const result: iAllUserAccount = {
      count,
      userAccounts: []
    };

    users.forEach(user => result.userAccounts.push({
      createdAt: user.createdAt,
      id: user.id,
      isAdmin: user.isAdmin,
      last_connexion: user.last_connexion,
      login: user.login,
      updatedAt: user.updatedAt,
    }));

    res.status(200).json(result);

  } catch (e) { next(e); }
});

userRouter.all("/", error405(["GET"]));

userRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await UserAccount.findOne({
      attributes: ["id", "login", "isAdmin", "last_connexion", "createdAt", "updatedAt"],
      where: { id: req.params.id },
    });

    if (!user) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const result: iUserAccount = {
      createdAt: user.createdAt,
      id: user.id,
      isAdmin: user.isAdmin,
      last_connexion: user.last_connexion,
      login: user.login,
      updatedAt: user.updatedAt,
    };

    res.status(200).json(result);

  } catch (e) { next(e); }
});

userRouter.delete("/:id", async (req, res, next) => {
  try {
    const isDeleted = await UserAccount.destroy({
      force: req.query.forceDelete === "true",
      where: { id: req.params.id },
    });

    if (!isDeleted) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }
  } catch (e) { next(e); }

  try {
    await axios.delete(`${process.env.API_MAIN_URL}/user/${req.params.id}`);
    res.status(204).send();
  } catch (e) {
    await UserAccount.restore({ where: { id: req.params.id } });

    // @ts-ignore
    if (e.isAxiosError && e.response && e.response.status !== 500) {
      // @ts-ignore
      res.status(e.response.status).json(e.response.data); return;
    }

    next(e);
  }
});

userRouter.all("/:id", error405(["GET", "DELETE"]));

userRouter.post("/:id/restore", async (req, res, next) => {
  try {
    const user = await UserAccount.findOne(
      {
        attributes: ["id", "deletedAt"],
        paranoid: false,
        where: {
          id: req.params.id
        },
      });

    if (!user) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable.`); return; }
    if (user.deletedAt === null) { error422(req, res, `L'utilisateur '${req.params.id}' n'est pas supprimé.`); return; }

    await user.restore();
  } catch (e) { next(e); }

  try {
    await axios.post(`${process.env.API_MAIN_URL}/user/${req.params.id}/restore`);
    res.status(204).send();
  } catch (e) {
    await UserAccount.destroy({ where: { id: req.params.id } });

    // @ts-ignore
    if (e.isAxiosError && e.response && e.response.status !== 500) {
      // @ts-ignore
      res.status(e.response.status).json(e.response.data); return;
    }

    next(e);
  }
});

export default userRouter;