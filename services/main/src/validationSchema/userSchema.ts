import * as Joi from "joi";

const userSchema = Joi.object({
  default_event_mail: Joi.string().email().optional(),
  username: Joi.string().normalize().optional(),
});

export default userSchema;