import * as express from "express";
import { UserAccount } from "../../../../databases/authentification/models/UserAccount";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
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

userRouter.all("/:id", error405(["GET"]));

export default userRouter;