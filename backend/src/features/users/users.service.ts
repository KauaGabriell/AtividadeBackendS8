import { userRepository, type PublicUser } from "./user.repository.js";

export class AuthenticatedUserNotFoundError extends Error {}

export async function getAuthenticatedUser(id: string): Promise<PublicUser> {
  const user = await userRepository.findPublicById(id);
  if (!user) {
    throw new AuthenticatedUserNotFoundError();
  }

  return user;
}
