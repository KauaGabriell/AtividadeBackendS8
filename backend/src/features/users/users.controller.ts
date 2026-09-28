import type { RequestHandler } from "express";
import { AuthenticatedUserNotFoundError, getAuthenticatedUser } from "./users.service.js";

export const getMe: RequestHandler = async (request, response, next) => {
  const userId = request.authenticatedUserId;
  if (!userId) {
    response.status(401).json({ error: "Autenticação necessária." });
    return;
  }

  try {
    const user = await getAuthenticatedUser(userId);
    response.status(200).json(user);
  } catch (error) {
    if (error instanceof AuthenticatedUserNotFoundError) {
      response.status(401).json({ error: "Autenticação inválida ou expirada." });
      return;
    }
    next(error);
  }
};
