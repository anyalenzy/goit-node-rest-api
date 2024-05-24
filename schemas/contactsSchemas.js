import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().required().email({ minDomainSegments: 2 }),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email({ minDomainSegments: 2 }),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export const paginationSchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
  favorite: Joi.boolean().valid(true, false),
});
