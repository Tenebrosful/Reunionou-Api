import * as express from "express";
import { User } from "../../database/models/User";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import error422 from "../errors/error422";
import { iallJoinedEvents, iallSelfEvents, iallUsers, iuser } from "../responseInterface/userResponse";

const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  try {
    const { count, rows: users } = await User.findAndCountAll(
      {
        attributes: ["id", "username", "default_event_mail", "last_connexion", "createdAt", "updatedAt"]
      });

    const result: iallUsers = {
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

userRouter.delete("/:id", async (req, res, next) => {
  try {
    const isDeleted = await User.destroy(
      {
        where: {
          id: req.params.id
        }
      });

    if (!isDeleted) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    res.status(204).send();
  } catch (e) { next(e); }
});

userRouter.post("/:id/restore", async (req, res, next) => {
  try {
    const user = await User.findOne(
      {
        attributes: ["id", "deletedAt"],
        paranoid: false,
        where: {
          id: req.params.id
        },
      });

    console.log(user?.toJSON());

    if (!user) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable.`); return; }
    if (user.deletedAt === null) { error422(req, res, `L'utilisateur '${req.params.id}' n'est pas supprimé.`); return; }

    await user.restore();

    res.status(204).send();
  } catch (e) { next(e); }
});

userRouter.get("/:id/self-event", async (req, res, next) => {
  try {
    const user = await User.findOne(
      {
        attributes: [ "id" ],
        where: {
          id: req.params.id
        }
      });

    if (!user) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const selfEvents = await user.$get("ownedEvents");

    const result: iallSelfEvents = {
      count: selfEvents.length,
      events: []
    };

    selfEvents.forEach(selfEvent => result.events.push({
      coords: {
        address: selfEvent.address,
        lat: selfEvent.lat,
        long: selfEvent.long,
      },
      description: selfEvent.description,
      id: selfEvent.id,
      title: selfEvent.title,
    }));

    res.status(200).json(result);

  } catch (e) { next(e); }
});

userRouter.get("/:id/joined-event", async (req, res, next) => {
  try {
    const user = await User.findOne(
      {
        attributes: [ "id" ],
        where: {
          id: req.params.id
        }
      });

    if (!user) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const joinedEvents = await user.$get("events");

    const result: iallJoinedEvents = {
      count: joinedEvents.length,
      events: []
    };

    joinedEvents.forEach(joinedEvent => result.events.push({
      // @ts-ignore BelongsToMany add UserEvent attribute
      comeToEvent: joinedEvent.UserEvent.comeToEvent,
      coords: {
        address: joinedEvent.address,
        lat: joinedEvent.lat,
        long: joinedEvent.long,
      },
      description: joinedEvent.description,
      id: joinedEvent.id,
      owner: joinedEvent.owner,
      title: joinedEvent.title,
    }));

    res.status(200).json(result);

  } catch (e) { next(e); }
});

userRouter.use("/", error405(["GET"]));

export default userRouter;