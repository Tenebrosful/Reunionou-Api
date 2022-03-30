import axios from "axios";
import * as express from "express";
import * as bcrypt from "bcrypt";
import { Op } from "sequelize";
import { UserAccount } from "../../../../databases/authentification/models/UserAccount";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import error422 from "../errors/error422";
import handleDataValidation from "../middleware/handleDataValidation";
import { iAllUserAccount, iUserAccount } from "../responseInterface/userResponse";
import userSchema from "../validateSchema/UserSchema";
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

userRouter.delete("/", async (req, res, next) => {
  try {
    await UserAccount.destroy({
      force: true,
      where: {
        deletedAt: {
          [Op.not]: null
        }
      }
    });

    const inactifsusers = await UserAccount.findAll({
      where: {
        last_connexion: {
          [Op.lte]: new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 30))
        }
      }
    });

    const promises = inactifsusers.map(async user => {
      user.destroy({ force: req.query.forceDelete === "true" });

      try {
        await axios.delete(`${process.env.API_MAIN_URL}/user/${user.id}${req.query.forceDelete === "true" ? "?forceDelete=true" : ""}`);
      } catch (e) {
        user.restore();
      }
    });

    await Promise.all(promises);

    res.status(204).send();
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

userRouter.patch("/:id", async (req, res, next) => {
  const bodyFields = {
    login: req.body.login,
    password: req.body.password,
  };

  if (!handleDataValidation(userSchema, bodyFields, req, res)) return;

  const validedFields = {
    login: bodyFields.login,
    password: await bcrypt.hash(bodyFields.password, 10),
  };

  try {
    const user = await UserAccount.findOne(
      {
        where: {
          id: req.params.id
        }
      });

    if (!user) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const isUpdated = user.update({...validedFields});

    if (!isUpdated) { error422(req, res, `L'utilisateur '${req.params.id}' n'a pas pu être mis à jour.`); return; }

    res.status(204).send();

  } catch (e) { next(e); }

});

userRouter.all("/:id", error405(["GET", "DELETE", "PATCH"]));

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