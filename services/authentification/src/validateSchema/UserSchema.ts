import * as Joi from "joi";

const userSchema = Joi.object({
  login: Joi.string().alphanum().optional(),
  password: Joi.string().optional(),
});

export default userSchema;