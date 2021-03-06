import * as express from "express";
import { Op } from "sequelize";
import { User } from "../../../../databases/main/models/User";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import error422 from "../errors/error422";
import handleDataValidation from "../middleware/handleDataValidation";
import { iallEvents, iallUsers, iautocomplete, ipartipantEvent, iuser } from "../responseInterface/userResponse";
import userSchema from "../validationSchema/userSchema";
const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  try {
    const { count, rows: users } = await User.findAndCountAll(
      {
        attributes: ["id", "username", "default_event_mail", "profile_image_url", "createdAt", "updatedAt"]
      });

    const result: iallUsers = {
      count,
      users: []
    };

    users.forEach(user => result.users.push({
      createdAt: user.createdAt,
      default_event_mail: user.default_event_mail,
      id: user.id,
      profile_image_url: user.profile_image_url,
      updatedAt: user.updatedAt,
      username: user.username,
    }));

    res.status(200).json(result);
  } catch (e) { next(e); }

});

userRouter.delete("/", async (req, res, next) => {
  try {
    await User.destroy({
      force: true,
      where: {
        deletedAt: {
          [Op.not]: null
        }
      }
    });

    res.status(204).send();
  } catch (e) { next(e); }
});

userRouter.post("/", async (req, res, next) => {

  const userFields = {
    default_event_mail: req.body.default_event_mail,
    id: req.body.id,
    username: req.body.username,
  };

  try {
    const user = await User.create({ ...userFields });

    if (user)
      res.status(201).json(user);

  } catch (error) {
    next(error);
  }
});

userRouter.all("/", error405(["GET", "DELETE", "POST"]));

userRouter.get("/autocomplete", async (req, res, next) => {
  if (!req.query.q) { res.status(200).json({ count: 0, usernames: [] }); return; }

  try {
    const { count, rows: users } = await User.findAndCountAll({
      attributes: ["id", "username"],
      limit: 8,
      where: {
        username: {
          [Op.like]: `%${req.query.q}%`
        }
      },
    });

    const resData: iautocomplete = {
      count,
      users: []
    };

    users.forEach(user => resData.users.push({
      id: user.id,
      username: user.username
    }));

    res.status(200).json(resData);
  } catch (e) { next(e); }
});

userRouter.all("/autocomplete", error405(["GET"]));

userRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findOne(
      {
        attributes: ["id", "username", "default_event_mail", "profile_image_url", "createdAt", "updatedAt"],
        where: {
          id: req.params.id
        }
      });

    if (!user) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const result: iuser = {
      createdAt: user.createdAt,
      default_event_mail: user.default_event_mail,
      id: user.id,
      profile_image_url: user.profile_image_url,
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
        force: req.query.forceDelete === "true",
        where: {
          id: req.params.id
        }
      });

    if (!isDeleted) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

userRouter.patch("/:id", async (req, res, next) => {
  const userFields = {
    default_event_mail: req.body.default_mail,
    profile_image_url: req.body.profile_image_url,
    username: req.body.username,
  };

  if (!handleDataValidation(userSchema, userFields, req, res)) return;

  try {
    const user = await User.findOne(
      {
        where: {
          id: req.params.id
        }
      });

    if (!user) { error404(req, res, `L'utilisateur '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const isUpdated = user.update({ ...userFields });

    if (!isUpdated) { error422(req, res, `L'utilisateur '${req.params.id}' n'a pas pu ??tre mis ?? jour.`); return; }

    res.status(204).send();

  } catch (e) { next(e); }
});

userRouter.all("/:id", error405(["GET", "DELETE", "PATCH"]));

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
    if (user.deletedAt === null) { error422(req, res, `L'utilisateur '${req.params.id}' n'est pas supprim??.`); return; }

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
            profile_image_url: participant.profile_image_url,
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
            profile_image_url: participant.profile_image_url,
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
            profile_image_url: owner.profile_image_url,
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