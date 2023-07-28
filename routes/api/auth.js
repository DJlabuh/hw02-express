import express from "express";

import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import userSchemas from "../../schemas/users-schemas.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validateBody(userSchemas.userSignupSchema),
  authController.signup
);

authRouter.post(
  "/signin",
  validateBody(userSchemas.userSigninSchema),
  authController.signin
);

export default authRouter;
