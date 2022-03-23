import * as Joi from "joi";

const eventSchema = Joi.object({
  coords: {
    address: Joi.string(),
    lat: Joi.number().min(-90).max(90),
    long: Joi.number().min(-90).max(90),
  },
  date: Joi.date().greater("now"),
  description: Joi.string().optional(),
  owner_id: Joi.string().uuid().optional(),
  title: Joi.string().alphanum(),
});

export default eventSchema;