import * as express from "express";
import { User } from "../../database/models/User";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import { igetAllUsers, iuser } from "../responseInterface/userResponse";

const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  try {
    const { count, rows: users } = await User.findAndCountAll(
      {
        attributes: ["id", "username", "default_event_mail", "last_connexion", "createdAt", "updatedAt"]
      });

    const result: igetAllUsers = {
      count,
      users: []
    };

    users.forEach(user => result.users.push({
      createdAt: user.createdAt,
      default_event_mail: user.default_event_mail,
      id: user.id,
      last_connexion: user.last_connexion,
      updatedAt: user.updatedAt,
      username: user.username,
    }));

    res.status(200).json(result);
  } catch (e) { next(e); }

});

userRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findOne(
      {
        attributes: ["id", "username", "default_event_mail", "last_connexion", "createdAt", "updatedAt"],
        where: {
          id: req.params.id
        }
      });

    if (!user) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const result: iuser = {
      createdAt: user.createdAt,
      default_event_mail: user.default_event_mail,
      id: user.id,
      last_connexion: user.last_connexion,
      updatedAt: user.updatedAt,
      username: user.username,
    };

    res.status(200).json(result);
  } catch (e) { next(e); }
});

userRouter.use("/", error405(["GET"]));

export default userRouter;