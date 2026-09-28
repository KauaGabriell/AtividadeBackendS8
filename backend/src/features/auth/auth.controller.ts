import type { RequestHandler, Response } from "express";
import { z } from "zod";
import { env } from "../../config/env.js";
import { AUTH_COOKIE_NAME } from "./auth.constants.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  loginUser,
  registerUser,
} from "./auth.service.js";

function sendValidationError(response: Response, error: z.ZodError): void {
  response.status(400).json({
    error: "Dados inválidos.",
    details: error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
}

export const register: RequestHandler = async (request, response, next) => {
  const parsedBody = registerSchema.safeParse(request.body);
  if (!parsedBody.success) {
    sendValidationError(response, parsedBody.error);
    return;
  }

  try {
    const user = await registerUser(parsedBody.data);
    response.status(201).json(user);
  } catch (error) {
    if (error instanceof EmailAlreadyRegisteredError) {
      response.status(409).json({ error: "Este e-mail já está cadastrado." });
      return;
    }
    next(error);
  }
};

export const login: RequestHandler = async (request, response, next) => {
  const parsedBody = loginSchema.safeParse(request.body);
  if (!parsedBody.success) {
    sendValidationError(response, parsedBody.error);
    return;
  }

  try {
    const { user, token } = await loginUser(parsedBody.data);
    response.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });
    response.status(200).json(user);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      response.status(401).json({ error: "E-mail ou senha inválidos." });
      return;
    }
    next(error);
  }
};
