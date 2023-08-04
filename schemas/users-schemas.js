import Joi from "joi";

import { emailRegexp } from "../constants/user-constants.js";

const userRegisterSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "Email is required.",
    "string.pattern.base": "Invalid email format.",
    "string.empty": "Email cannot be empty.",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required.",
    "string.min": "Password should be at least 6 characters long.",
    "string.empty": "Password cannot be empty.",
  }),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter")
    .optional()
    .messages({
      "string.empty": "Subscription cannot be empty.",
      "any.only":
        "Invalid subscription type. Allowed values: starter, pro, business.",
    }),
});

const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "Email is required.",
    "string.pattern.base": "Invalid email format.",
    "string.empty": "Email cannot be empty.",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required.",
    "string.min": "Password should be at least 6 characters long.",
    "string.empty": "Password cannot be empty.",
  }),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .required()
    .messages({
      "any.required": "Subscription is required.",
      "any.only":
        "Invalid subscription type. Allowed values: starter, pro, business.",
    }),
});

export default {
  userRegisterSchema,
  userLoginSchema,
  updateSubscriptionSchema,
};
