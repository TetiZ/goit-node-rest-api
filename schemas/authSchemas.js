import Joi from "joi";

export const registerUserSchema = Joi.object({
  name: Joi.string().lowercase().trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

export const emailCheckSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});
