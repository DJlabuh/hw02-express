import Joi from "joi";

import { emailRegexp } from "../constants/user-constants.js";

const userSignupSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required.",
    "string.empty": "Name cannot be empty.",
  }),
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

const userSigninSchema = Joi.object({
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

export default {
  userSignupSchema,
  userSigninSchema,
};
