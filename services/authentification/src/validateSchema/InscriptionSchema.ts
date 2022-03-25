import * as Joi from "joi";

const InscriptionSchema = Joi.object({
  login: Joi.string().alphanum(),
  password: Joi.string(),
  username: Joi.string().normalize(),
  default_mail: Joi.string().email().optional()
});

export default InscriptionSchema;