import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import { AUTH_COOKIE_NAME } from "../features/auth/auth.constants.js";

export const requireAuth: RequestHandler = (request, response, next) => {
  const token = request.cookies?.[AUTH_COOKIE_NAME];

  if (typeof token !== "string") {
    response.status(401).json({ error: "Autenticação necessária." });
    return;
  }

  let payload: JwtPayload;
  try {
    const verifiedPayload = jwt.verify(token, env.JWT_SECRET);
    if (typeof verifiedPayload === "string") {
      response.status(401).json({ error: "Autenticação inválida ou expirada." });
      return;
    }
    payload = verifiedPayload;
  } catch {
    response.status(401).json({ error: "Autenticação inválida ou expirada." });
    return;
  }

  if (typeof payload.sub !== "string") {
    response.status(401).json({ error: "Autenticação inválida ou expirada." });
    return;
  }

  request.authenticatedUserId = payload.sub;
  next();
};
