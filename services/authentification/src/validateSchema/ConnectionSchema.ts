import * as Joi from "joi";

const ConnectionSchema = Joi.object({
    login: Joi.string().alphanum(),
  password: Joi.string().alphanum(),
});

export default ConnectionSchema;