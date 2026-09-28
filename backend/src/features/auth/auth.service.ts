import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import {
  DuplicateEmailPersistenceError,
  userRepository,
  type PublicUser,
} from "../users/user.repository.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";

const TOKEN_DURATION_SECONDS = 60 * 60;

export class EmailAlreadyRegisteredError extends Error {}

export class InvalidCredentialsError extends Error {}

export async function registerUser(input: RegisterInput): Promise<PublicUser> {
  const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });

  try {
    return await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });
  } catch (error) {
    if (error instanceof DuplicateEmailPersistenceError) {
      throw new EmailAlreadyRegisteredError();
    }
    throw error;
  }
}

export async function loginUser(input: LoginInput): Promise<{ user: PublicUser; token: string }> {
  const user = await userRepository.findByEmail(input.email);
  const passwordMatches = user
    ? await argon2.verify(user.passwordHash, input.password)
    : false;

  if (!user || !passwordMatches) {
    throw new InvalidCredentialsError();
  }

  const token = jwt.sign({}, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: TOKEN_DURATION_SECONDS,
  });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
}
