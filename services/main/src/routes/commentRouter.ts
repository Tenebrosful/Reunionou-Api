import * as express from "express";
import { Comment } from "../../../../databases/main/models/Comment";
import error404 from "../errors/error404";
import error405 from "../errors/error405";
import { iallComments, icomment } from "../responseInterface/eventResponse";
const commentRouter = express.Router();

commentRouter.get("/", async (req, res, next) => {
  try {
    const { count, rows: comments } = await Comment.findAndCountAll(
      {
        attributes: ["id", "user_id", "event_id", "message", "createdAt", "updatedAt"]
      });

    const result: iallComments = {
      comments: [],
      count,
    };

    const promises = comments.map(async (comment) => {
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

      if (req.query.embedEvent)
        if (comment.event_id === null) e.event = null;
        else {
          const event = await comment.$get("event");

          if (!event) return;

          e.event = {
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

          if (req.query.embedOwner)
            if (event.owner_id === null) e.event.owner = null;
            else {
              const owner = await event.$get("owner");

              if (!owner) return;

              e.event.owner = {
                createdAt: owner.createdAt,
                id: owner.id,
                updatedAt: owner.updatedAt,
                username: owner.username,
              };
            }

          if (req.query.participants) {
            e.event.participants = [];

            const participants = await event.$get("participants");

            let comingParticipant = 0;

            const participantsPromises = participants.map(async (participant) => {
              e.event?.participants?.push({
                comeToEvent: participant.UserEvent.comeToEvent,
                createdAt: participant.createdAt,
                id: participant.id,
                updatedAt: participant.updatedAt,
                username: participant.username,
              });
              if (participant.UserEvent.comeToEvent) comingParticipant++;
            });

            e.event.comingParticipant = comingParticipant;
            e.event.totalParticipant = participants.length;

            await Promise.all(participantsPromises);
          }
        }

      result.comments.push(e);

    });

    await Promise.all(promises);

    res.status(200).json(result);

  } catch (e) { next(e); }
});

commentRouter.all("/", error405(["GET"]));

commentRouter.get("/:id", async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      attributes: ["id", "user_id", "event_id", "message", "createdAt", "updatedAt"],
      where: { id: req.params.id },
    });

    if (!comment) { error404(req, res, `Commentaire ${req.params.id} introuvable`); return; }

    const result: icomment = {
      author_id: comment.user_id,
      createdAt: comment.createdAt,
      event_id: comment.event_id,
      id: comment.id,
      message: comment.message,
      updatedAt: comment.updatedAt,
    };

    if (req.query.embedAuthor)
      if (comment.user_id === null) result.author = null;
      else {
        const author = await comment.$get("author");

        if (!author) return;

        result.author = {
          createdAt: author.createdAt,
          id: author.id,
          updatedAt: author.updatedAt,
          username: author.username,
        };
      }

    if (req.query.embedEvent)
      if (comment.event_id === null) result.event = null;
      else {
        const event = await comment.$get("event");

        if (!event) return;

        result.event = {
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

        if (req.query.embedOwner)
          if (event.owner_id === null) result.event.owner = null;
          else {
            const owner = await event.$get("owner");

            if (!owner) return;

            result.event.owner = {
              createdAt: owner.createdAt,
              id: owner.id,
              updatedAt: owner.updatedAt,
              username: owner.username,
            };
          }

        if (req.query.participants) {
          result.event.participants = [];

          const participants = await event.$get("participants");

          let comingParticipant = 0;

          const participantsPromises = participants.map(async (participant) => {
            result.event?.participants?.push({
              comeToEvent: participant.UserEvent.comeToEvent,
              createdAt: participant.createdAt,
              id: participant.id,
              updatedAt: participant.updatedAt,
              username: participant.username,
            });
            if (participant.UserEvent.comeToEvent) comingParticipant++;
          });

          result.event.comingParticipant = comingParticipant;
          result.event.totalParticipant = participants.length;

          await Promise.all(participantsPromises);
        }
      }

    res.status(200).json(result);
  } catch (e) { next(e); }
});

export default commentRouter;