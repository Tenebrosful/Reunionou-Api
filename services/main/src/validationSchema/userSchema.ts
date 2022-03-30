import * as Joi from "joi";

const userSchema = Joi.object({
  default_event_mail: Joi.string().email().optional(),
  profile_image_url: Joi.string().uri().optional(),
  username: Joi.string().normalize().optional(),
});

export default userSchema;