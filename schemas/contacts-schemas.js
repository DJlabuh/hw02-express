import Joi from "joi";

const contactsAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" field is required`,
    "string.empty": `"name" cannot be an empty string`,
  }),
  email: Joi.string().email().required().messages({
    "any.required": `"email" field is required`,
    "string.email": `"email" must be a valid email address`,
    "string.empty": `"email" cannot be an empty string`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `"phone" field is required`,
    "string.empty": `"phone" cannot be an empty string`,
  }),
});

export default {
  contactsAddSchema,
};
