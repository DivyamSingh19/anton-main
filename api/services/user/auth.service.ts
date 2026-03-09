import prisma from "../../db/db";
import { NotFoundError, ServerError } from "../error.service";

export class AuthService {
  async findUser(email: string) {
    try {
      const user = await prisma.user.findFirst({
        where: { email },
      });
      if (!user) {
        throw new NotFoundError("User not found in database");
      }
      const data = {
        email: user.email,
        username: user.username,
        id: user.id,
      };
      return data;
    } catch (error) {
      throw new ServerError("Could not find user, Internal server error");
    }
  }
  async findUserFromId(userId: string) {
    try {
      const user = await prisma.user.findFirst({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundError("User not found in the database");
      }
      const data = {
        email: user.email,
        username: user.username,
        id: user.id,
      };
      return data;
    } catch (error) {
      throw new ServerError("Could not find user, Internal server error");
    }
  }
  async create(username: string, email: string, passwordHash: string) {
    try {
      const createUser = await prisma.user.create({
        data: {
          username: username,
          email: email,
          passwordHash: passwordHash,
        },
      });
      if (!createUser) {
        throw new ServerError("Could not create user, Internal server error");
      }
      return createUser;
    } catch (error) {
      throw new ServerError("Could not create user, internal server error");
    }
  }
}
