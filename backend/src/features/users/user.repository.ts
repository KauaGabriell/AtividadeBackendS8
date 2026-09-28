import { prisma } from "../../db/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

export interface UserWithPassword extends PublicUser {
  passwordHash: string;
}

export class DuplicateEmailPersistenceError extends Error {}

export const userRepository = {
  async create(data: { name: string; email: string; passwordHash: string }): Promise<PublicUser> {
    try {
      return await prisma.user.create({
        data,
        select: { id: true, name: true, email: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new DuplicateEmailPersistenceError();
      }
      throw error;
    }
  },

  findByEmail(email: string): Promise<UserWithPassword | null> {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, passwordHash: true },
    });
  },

  findPublicById(id: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });
  },
};
