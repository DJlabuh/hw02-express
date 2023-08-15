import express from "express";

import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import userSchemas from "../../schemas/users-schemas.js";

import { authenticate, upload } from "../../middlewars/index.js";

const authRouter = express.Router();

authRouter.post(
  "/users/register",
  upload.single("avatar"),
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

authRouter.patch(
  "/users/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);

export default authRouter;
