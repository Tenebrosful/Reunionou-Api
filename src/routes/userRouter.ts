import * as express from "express";
import { User } from "../../database/models/User";
import error405 from "../errors/error405";
import { igetAllUsers } from "../responseInterface/userResponse";

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  const {count, rows: users} = await User.findAndCountAll(
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
});

userRouter.use("/", error405(["GET"]));

export default userRouter;