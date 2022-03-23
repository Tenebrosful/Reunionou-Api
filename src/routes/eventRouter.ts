import events = require("events");
import * as express from "express";
import { Event } from "../../database/models/Event";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import { iallEvents, ievent } from "../responseInterface/eventResponse";

const eventRouter = express.Router();

eventRouter.get("/", async (req, res, next) => {
  try {
    const { count, rows: events } = await Event.findAndCountAll(
      {
        attributes: ["id", "title", "description", "address", "lat", "long", "owner_id", "createdAt", "updatedAt"]
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
      description: event.description,
      id: event.id,
      owner_id: event.owner_id,
      title: event.title,
    }));

    res.status(200).json(result);
  } catch (e) { next(e); }

});

eventRouter.all("/", error405(["GET"]));

eventRouter.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findOne(
      {
        attributes: ["id", "title", "description", "address", "lat", "long", "owner_id", "createdAt", "updatedAt"],
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
      description: event.description,
      id: event.id,
      owner_id: event.owner_id,
      title: event.title,
    };

    res.status(200).json(result);
  } catch (e) { next(e); }

});

export default eventRouter;