import * as Joi from "joi";

const userSchema = Joi.object({
  default_mail: Joi.string().email().optional(),
  password: Joi.string(),
  username: Joi.string().normalize(),
});

export default userSchema;