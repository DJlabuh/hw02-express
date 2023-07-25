import Joi from "joi";

const contactsAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" field is required`,
    "string.empty": `"name" cannot be an empty string`,
  }),
  email: Joi.string().email().messages({
    "string.email": `"email" must be a valid email address`,
    "string.empty": `"email" cannot be an empty string`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `"phone" field is required`,
    "string.empty": `"phone" cannot be an empty string`,
  }),
  favorite: Joi.boolean().messages({
    "boolean.base": `"favorite" must be a boolean value`,
  }),
});

const contactUpdateFavorite = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": `"favorite" field is required`,
    "boolean.base": `"favorite" must be a boolean value`,
  }),
});

export default {
  contactsAddSchema,
  contactUpdateFavorite,
};
