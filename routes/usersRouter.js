import express from "express";
import {
  register,
  login,
  logout,
  updateSubscription,
  getCurrentUser,
} from "../controllers/authControllers.js";
import { changeAvatar } from "../controllers/usersControllers.js";
import upload from "../middlewares/upload.js";
import auth from "../middlewares/auth.js";

import validateBody from "../helpers/validateBody.js";
import {
  registerSchema,
  loginSchema,
  subscriptionShema,
} from "../schemas/usersShemas.js";

const usersRouter = express.Router();
usersRouter.post("/register", validateBody(registerSchema), register);
usersRouter.post("/login", validateBody(loginSchema), login);
usersRouter.post("/logout", auth, logout);
usersRouter.get("/current", auth, getCurrentUser);
usersRouter.patch(
  "/",
  auth,
  validateBody(subscriptionShema),
  updateSubscription
);
usersRouter.patch("/avatars", auth, upload.single("avatar"), changeAvatar);

export default usersRouter;
