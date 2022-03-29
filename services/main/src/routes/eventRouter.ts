import * as express from "express";
import { Comment } from "../../../../databases/main/models/Comment";
import { Event } from "../../../../databases/main/models/Event";
import { User } from "../../../../databases/main/models/User";
import { UserEvent } from "../../../../databases/main/models/UserEvent";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import error422 from "../errors/error422";
import handleDataValidation from "../middleware/handleDataValidation";
import { iNewComment, iNewEvent } from "../requestInterface/eventRequest";
import { iallComments, iallEvents, iallParticipants, icomment, ievent } from "../responseInterface/eventResponse";
import commentSchema from "../validationSchema/commentSchema";
import eventSchema from "../validationSchema/eventSchema";

const eventRouter = express.Router();

eventRouter.get("/", async (req, res, next) => {
  try {
    const { count, rows: events } = await Event.findAndCountAll(
      {
        attributes: ["id", "title", "description", "mail", "date", "address", "lat", "long", "owner_id", "createdAt", "updatedAt"]
      });

    const result: iallEvents = {
      count,
      events: []
    };

    const promises = events.map(async event => {
      const e: ievent = {
        coords: {
          address: event.address,
          lat: event.lat,
          long: event.long,
        },
        createdAt: event.createdAt,
        date: event.date,
        description: event.description,
        id: event.id,
        mail: event.mail,
        owner_id: event.owner_id,
        title: event.title,
        updatedAt: event.updatedAt,
      };

      if (req.query.participants) {
        e.participants = [];

        const participants = await event.$get("participants");

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
        if (event.owner_id === null) e.owner = null;
        else {
          const owner = await event.$get("owner");

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

eventRouter.post("/", async (req, res, next) => {
  const requestFields: iNewEvent = {
    coords: {
      address: req.body.coords?.address,
      lat: req.body.coords?.lat,
      long: req.body.coords?.long,
    },
    date: req.body.date,
    description: req.body.description,
    mail: req.body.mail,
    owner_id: req.body.owner_id,
    title: req.body.title
  };

  if (!handleDataValidation(eventSchema, requestFields, req, res, true)) return;

  const validedFields = {
    address: requestFields.coords.address,
    date: requestFields.date,
    description: requestFields.description,
    lat: requestFields.coords.lat,
    long: requestFields.coords.long,
    mail: requestFields.mail,
    owner_id: requestFields.owner_id,
    title: requestFields.title,
  };

  try {

    if (validedFields.owner_id) {
      const owner = await User.findOne(
        {
          attributes: ["id", "default_event_mail"],
          where: {
            id: validedFields.owner_id
          }
        });

      if (!owner) { error422(req, res, `L'utilisateur '${validedFields.owner_id}' est introuvable. (Potentiellement soft-delete)`); return; }

      if (!validedFields.mail) validedFields.mail = owner.default_event_mail;
    }

    const newEvent = await Event.create({ ...validedFields });

    if (!newEvent) return;

    const resData: ievent = {
      coords: {
        address: newEvent.address,
        lat: newEvent.lat,
        long: newEvent.long
      },
      createdAt: newEvent.createdAt,
      date: newEvent.date,
      description: newEvent.description,
      id: newEvent.id,
      mail: newEvent.mail,
      owner_id: newEvent.owner_id,
      title: newEvent.title,
      updatedAt: newEvent.updatedAt,
    };

    res.status(201).json(resData);

  } catch (e) { next(e); }

});

eventRouter.all("/", error405(["GET"]));

eventRouter.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findOne(
      {
        attributes: ["id", "title", "description", "mail", "date", "address", "lat", "long", "owner_id", "createdAt", "updatedAt"],
        where: {
          id: req.params.id
        }
      });


    if (!event) { error404(req, res, `L'évènement '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const result: ievent = {
      coords: {
        address: event.address,
        lat: event.lat,
        long: event.long
      },
      createdAt: event.createdAt,
      date: event.date,
      description: event.description,
      id: event.id,
      mail: event.mail,
      owner_id: event.owner_id,
      title: event.title,
      updatedAt: event.updatedAt,
    };

    if (req.query.participants) {
      result.participants = [];

      const participants = await event.$get("participants");

      let comingParticipant = 0;

      participants.forEach(participant => {
        result.participants?.push({
          comeToEvent: participant.UserEvent.comeToEvent,
          createdAt: participant.createdAt,
          id: participant.id,
          updatedAt: participant.updatedAt,
          username: participant.username,
        });
        if (participant.UserEvent.comeToEvent) comingParticipant++;
      });

      result.comingParticipant = comingParticipant;
      result.totalParticipant = participants.length;
    }

    if (req.query.embedOwner)
      if (event.owner_id === null) result.owner = null;
      else {
        const owner = await event.$get("owner");

        if (!owner) return;

        result.owner = {
          createdAt: owner.createdAt,
          id: owner.id,
          updatedAt: owner.updatedAt,
          username: owner.username,
        };
      }

    res.status(200).json(result);
  } catch (e) { next(e); }

});

eventRouter.delete("/:id", async (req, res, next) => {
  try {
    const isDeleted = await Event.destroy(
      {
        where: {
          id: req.params.id
        }
      });

    if (!isDeleted) { error404(req, res, `L'évènement '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    res.status(204).send();
  } catch (e) { next(e); }
});

eventRouter.all("/:id", error405(["GET", "DELETE"]));

eventRouter.get("/:id/participants", async (req, res, next) => {
  try {
    const event = await Event.findOne(
      {
        attributes: ["id"],
        where: {
          id: req.params.id
        }
      });


    if (!event) { error404(req, res, `L'évènement '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const participants = await event.$get("participants");

    const result: iallParticipants = {
      count: participants.length,
      participants: []
    };

    participants.forEach(participant => result.participants.push({
      comeToEvent: participant.UserEvent.comeToEvent,
      createdAt: participant.createdAt,
      id: participant.id,
      updatedAt: participant.updatedAt,
      username: participant.username,
    }));

    res.status(200).json(result);
  } catch (e) { next(e); }

});

eventRouter.all("/:id/participants", error405(["GET"]));

eventRouter.post("/:id/join-event", async (req, res, next) => {

  const participantFields = {
    comeToEvent: req.body.comeToEvent || false,
    event_id: req.params.id,
    user_id: req.body.user_id,
    username: req.body.username,
  };

  try {

    const event = await Event.findOne(
      {
        attributes: ["id"],
        where: {
          id: req.params.id
        }
      });


    if (!event) { error404(req, res, `L'évènement '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const [eventParticipant, created]  = await UserEvent.upsert({...participantFields});

    if(created) res.status(201).json(eventParticipant.toJSON());
    else res.status(200).send();
  
  } catch (e) { next(e); }

});

eventRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const event = await Event.findOne(
      {
        attributes: ["id", "title", "description", "address", "lat", "long", "owner_id", "createdAt", "updatedAt"],
        where: {
          id: req.params.id
        }
      });


    if (!event) { error404(req, res, `L'évènement '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const comments = await event.$get("comments");

    const result: iallComments = {
      comments: [],
      count: comments.length,
    };

    const promises = comments.map(async comment => {
      const e: icomment = {
        author_id: comment.user_id,
        createdAt: comment.createdAt,
        event_id: comment.event_id,
        id: comment.id,
        message: comment.message,
        updatedAt: comment.updatedAt,
      };

      if (req.query.embedAuthor)
        if (comment.user_id === null) e.author = null;
        else {
          const author = await comment.$get("author");

          if (!author) return;

          e.author = {
            createdAt: author.createdAt,
            id: author.id,
            updatedAt: author.updatedAt,
            username: author.username,
          };
        }


      result.comments.push(e);
    });

    await Promise.all(promises);

    res.status(200).json(result);
  } catch (e) { next(e); }

});

eventRouter.post("/:id/comments", async (req, res, next) => {
  const requestFields: iNewComment = {
    author_id: req.body.author_id,
    message: req.body.message,
  };

  if (!handleDataValidation(commentSchema, requestFields, req, res, true)) return;

  const validedFields = {
    message: requestFields.message,
    user_id: requestFields.author_id,
  };

  try {
    const event = await Event.findOne(
      {
        attributes: ["id", "title", "description", "address", "lat", "long", "owner_id", "createdAt", "updatedAt"],
        where: {
          id: req.params.id
        }
      });

    if (!event) { error404(req, res, `L'évènement '${req.params.id}' est introuvable. (Potentiellement soft-delete)`); return; }

    const comment = await Comment.create({...validedFields, event_id: event.id});

    if (!comment) return;

    const resData: icomment = {
      author_id: comment.user_id,
      createdAt: comment.createdAt,
      event_id: comment.event_id,
      id: comment.id,
      message: comment.message,
      updatedAt: comment.updatedAt,
    };

    res.status(201).json(resData);

  } catch (e) { next(e); }
});

eventRouter.all("/:id/comments", error405(["GET", "POST"]));

export default eventRouter;