import * as Joi from "joi";

const commentSchema = Joi.object({
  author_id: Joi.string().uuid().optional(),
  message: Joi.string().normalize(),
});

export default commentSchema;