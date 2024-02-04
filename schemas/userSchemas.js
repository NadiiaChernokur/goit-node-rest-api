import Joi from "joi";
const allowedSubscriptions = ["starter", "pro", "business"];

export const createUserSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required(),
  password: Joi.string().min(6).required(),
});

export const updateSubscription = Joi.object({
  email: Joi.string().pattern(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  ),

  subscription: Joi.string()
    .valid(...allowedSubscriptions)
    .required(),
});
