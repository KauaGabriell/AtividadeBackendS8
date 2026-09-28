import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { authRouter } from "./features/auth/auth.routes.js";
import { usersRouter } from "./features/users/users.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(cors({ origin: env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use("/api", (_request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  next();
});

app.get("/api/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});
app.use("/api/auth", authRouter);
app.use("/api", usersRouter);

app.use((_request, response) => {
  response.status(404).json({ error: "Rota não encontrada." });
});
app.use(errorHandler);
