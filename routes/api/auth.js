import express from "express";

import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import userSchemas from "../../schemas/users-schemas.js";

import { authenticate } from "../../middlewars/index.js";

const authRouter = express.Router();

authRouter.post(
  "/users/register",
  validateBody(userSchemas.userRegisterSchema),
  authController.register
);

authRouter.post(
  "/users/login",
  validateBody(userSchemas.userLoginSchema),
  authController.login
);

authRouter.get("/users/current", authenticate, authController.getCurrent);

authRouter.post("/users/logout", authenticate, authController.logout);

authRouter.patch(
  "/users",
  authenticate,
  validateBody(userSchemas.updateSubscriptionSchema),
  authController.updatesubscription
);

export default authRouter;
