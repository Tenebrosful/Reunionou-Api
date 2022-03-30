import * as Joi from "joi";

const commentSchema = Joi.object({
  author_id: Joi.string().uuid(),
  media: Joi.string().uri().optional(),
  message: Joi.string().normalize().optional(),
});

export default commentSchema;