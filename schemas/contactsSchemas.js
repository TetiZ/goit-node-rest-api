import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(2),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ua"] },
    })
    .required(),
  phone: Joi.string().length(10).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().required().min(2),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ua"] },
  }),
  phone: Joi.string().length(10).required(),
});
