import Joi from "joi";

const emailRegepxp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const registerSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegepxp),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegepxp),
  password: Joi.string().min(6).required(),
});
