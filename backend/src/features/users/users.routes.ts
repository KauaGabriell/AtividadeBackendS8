import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth.js";
import { getMe } from "./users.controller.js";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, getMe);
