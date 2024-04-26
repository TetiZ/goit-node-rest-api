import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required.min(2),
  email: Joi.string().required.email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ua"] },
  }),
  phone: Joi.number().integer().min(10).max(10),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().required.min(2),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ua"] },
  }),
  phone: Joi.number().integer().min(10).max(10),
});
