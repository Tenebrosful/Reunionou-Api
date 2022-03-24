import * as express from "express";
import { User } from "../../database/models/User";
import userSchema from "../validationSchema/userSchema";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import error422 from "../errors/error422";
import handleDataValidation from "../middleware/handleDataValidation";
import { iNewUser } from "../requestInterface/userRequest";
import { iallEvents, iallUsers, ipartipantEvent, iuser } from "../responseInterface/userResponse";
import * as bcrypt from "bcrypt";

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

userRouter.post("/", async (req, res, next) => {
  const requestFields: iNewUser = {
    default_mail: req.body.default_mail,
    password: req.body.password,
    username: req.body.username,
  };

  if (!handleDataValidation(userSchema, requestFields, req, res, true)) return;

  const validedFields = {
    default_event_mail: requestFields.default_mail,
    password: await bcrypt.hash(requestFields.password, 10),
    username: requestFields.username,
  };

  try {
    const newUser = await User.create({ ...validedFields });

    if (!newUser) return;

    const resData: iuser = {
      createdAt: newUser.createdAt,
      default_event_mail: newUser.default_event_mail,
      id: newUser.id,
      last_connexion: newUser.last_connexion,
      updatedAt: newUser.updatedAt,
      username: newUser.username,
    };

    res.status(201).json(resData);

  } catch (e) { next(e); }
});

userRouter.all("/", error405(["GET", "POST"]));

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

userRouter.all("/:id", error405(["GET", "DELETE"]));

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

    if (!user) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable.`); return; }
    if (user.deletedAt === null) { error422(req, res, `L'utilisateur '${req.params.id}' n'est pas supprimé.`); return; }

    await user.restore();

    res.status(204).send();
  } catch (e) { next(e); }
});

userRouter.all("/:id/restore", error405(["POST"]));

userRouter.get("/:id/self-event", async (req, res, next) => {
  try {
    const user = await User.findOne(
      {
        attributes: ["id"],
        where: {
          id: req.params.id
        }
      });

    if (!user) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const selfEvents = await user.$get("ownedEvents");

    const result: iallEvents = {
      count: selfEvents.length,
      events: []
    };

    const promises = selfEvents.map(async selfEvent => {
      const e: ipartipantEvent = {
        coords: {
          address: selfEvent.address,
          lat: selfEvent.lat,
          long: selfEvent.long,
        },
        createdAt: selfEvent.createdAt,
        date: selfEvent.date,
        description: selfEvent.description,
        id: selfEvent.id,
        mail: selfEvent.mail,
        owner_id: selfEvent.owner_id,
        title: selfEvent.title,
        updatedAt: selfEvent.updatedAt,
      };

      if (req.query.participants) {
        e.participants = [];

        const participants = await selfEvent.$get("participants");

        let comingParticipant = 0;

        participants.forEach(participant => {
          e.participants?.push({
            comeToEvent: participant.UserEvent.comeToEvent,
            createdAt: participant.createdAt,
            id: participant.id,
            updatedAt: participant.updatedAt,
            username: participant.username,
          });
          if (participant.UserEvent.comeToEvent) comingParticipant++;
        });

        e.comingParticipant = comingParticipant;
        e.totalParticipant = participants.length;
      }

      result.events.push(e);
    });

    await Promise.all(promises);

    res.status(200).json(result);

  } catch (e) { next(e); }
});

userRouter.all("/:id/self-event", error405(["GET"]));

userRouter.get("/:id/joined-event", async (req, res, next) => {
  try {
    const user = await User.findOne(
      {
        attributes: ["id"],
        where: {
          id: req.params.id
        }
      });

    if (!user) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const joinedEvents = await user.$get("events");

    const result: iallEvents = {
      count: joinedEvents.length,
      events: []
    };

    const promises = joinedEvents.map(async joinedEvent => {
      const e: ipartipantEvent = {
        comeToEvent: joinedEvent.UserEvent.comeToEvent,
        coords: {
          address: joinedEvent.address,
          lat: joinedEvent.lat,
          long: joinedEvent.long,
        },
        createdAt: joinedEvent.createdAt,
        date: joinedEvent.date,
        description: joinedEvent.description,
        id: joinedEvent.id,
        mail: joinedEvent.mail,
        owner_id: joinedEvent.owner_id,
        title: joinedEvent.title,
        updatedAt: joinedEvent.updatedAt,
      };

      if (req.query.participants) {
        e.participants = [];

        const participants = await joinedEvent.$get("participants");

        let comingParticipant = 0;

        participants.forEach(participant => {
          e.participants?.push({
            comeToEvent: participant.UserEvent.comeToEvent,
            createdAt: participant.createdAt,
            id: participant.id,
            updatedAt: participant.updatedAt,
            username: participant.username,
          });
          if (participant.UserEvent.comeToEvent) comingParticipant++;
        });

        e.comingParticipant = comingParticipant;
        e.totalParticipant = participants.length;
      }

      if (req.query.embedOwner)
        if (joinedEvent.owner_id === null) e.owner = null;
        else {
          const owner = await joinedEvent.$get("owner");

          if (!owner) return;

          e.owner = {
            createdAt: owner.createdAt,
            id: owner.id,
            updatedAt: owner.updatedAt,
            username: owner.username,
          };
        }

      result.events.push(e);
    });

    await Promise.all(promises);

    res.status(200).json(result);

  } catch (e) { next(e); }
});

userRouter.all("/:id/joined-event", error405(["GET"]));

export default userRouter;