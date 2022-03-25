import * as Joi from "joi";

const AuthSchema = Joi.object({
  login: Joi.string().alphanum(),
  password: Joi.string(),
});

export default AuthSchema;