import express from "express";
import {
  register,
  login,
  logout,
  updateSubscription,
  getCurrentUser,
} from "../controllers/authControllers.js";

import validateBody from "../helpers/validateBody.js";
import validateObjectId from "../helpers/validateObjectId.js";
import { registerSchema, loginSchema } from "../schemas/usersShemas.js";

const authRouter = express.Router();
authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", logout);
authRouter.get("/current", getCurrentUser);
authRouter.patch("/", updateSubscription);

export default authRouter;
