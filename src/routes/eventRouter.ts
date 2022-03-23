import * as express from "express";
import { Event } from "../../database/models/Event";
import { User } from "../../database/models/User";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import error422 from "../errors/error422";
import handleDataValidation from "../middleware/handleDataValidation";
import { iNewEvent } from "../requestInterface/eventRequest";
import { iallComments, iallEvents, ievent } from "../responseInterface/eventResponse";
import eventSchema from "../validationSchema/eventSchema";

const eventRouter = express.Router();

eventRouter.get("/", async (req, res, next) => {
  try {
    const { count, rows: events } = await Event.findAndCountAll(
      {
        attributes: ["id", "title", "description", "date", "address", "lat", "long", "owner_id", "createdAt", "updatedAt"]
      });

    const result: iallEvents = {
      count,
      events: []
    };

    events.forEach(event => result.events.push({
      coords: {
        address: event.address,
        lat: event.lat,
        long: event.long
      },
      createdAt: event.createdAt,
      date: event.date,
      description: event.description,
      id: event.id,
      owner_id: event.owner_id,
      title: event.title,
      updatedAt: event.updatedAt,
    }));

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
    owner_id: requestFields.owner_id,
    title: requestFields.title,
  };

  try {

    if (validedFields.owner_id) {
      const existing_owner = (await User.count(
        {
          where: {
            id: validedFields.owner_id
          }
        }) > 0);

      if (!existing_owner) { error422(req, res, `L'utilisateur '${validedFields.owner_id}' est introuvable. (Potentiellement soft-delete)`); return; }
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
        attributes: ["id", "title", "description", "date", "address", "lat", "long", "owner_id", "createdAt", "updatedAt"],
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
      owner_id: event.owner_id,
      title: event.title,
      updatedAt: event.updatedAt,
    };

    res.status(200).json(result);
  } catch (e) { next(e); }

});

eventRouter.all("/:id", error405(["GET"]));

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

    comments.forEach(comment => result.comments.push({
      createdAt: comment.createdAt,
      event_id: comment.event_id,
      id: comment.id,
      message: comment.message,
      updatedAt: comment.updatedAt,
      user_id: comment.user_id,
    }));

    res.status(200).json(result);
  } catch (e) { next(e); }

});

eventRouter.all("/:id/comments", error405(["GET"]));

export default eventRouter;