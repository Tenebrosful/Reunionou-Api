import * as Joi from "joi";

const InscriptionSchema = Joi.object({
  default_mail: Joi.string().email().optional(),
  login: Joi.string().alphanum(),
  password: Joi.string(),
  username: Joi.string().normalize(),
});

export default InscriptionSchema;