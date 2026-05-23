import prisma from "../../db/db";
import { ServerError } from "../error.service";

export class ProjectService {
  async findAll(userId: string) {
    try {
      const projects = await prisma.userProjects.findMany({
        where: {
          userId,
        },
      });
      return projects;
    } catch (error) {
      throw new ServerError("Error finding all projects");
    }
  }
  async findById(userId: string, projectId: string) {
    try {
      const project = await prisma.userProjects.findFirst({
        where: {
          userId,
          id: projectId,
        },
      });
      return project;
    } catch (error) {
      throw new ServerError("Error finding project by id");
    }
  }
  async delete(userId: string, projectId: string) {
    try {
      const project = await prisma.userProjects.deleteMany({
        where: {
          userId,
          id: projectId,
        },
      });
      return project;
    } catch (error) {
      throw new ServerError("Error deleting project");
    }
  }
  async create(userId: string, projectData: any) {
    try {
      const project = await prisma.userProjects.create({
        data: {
          userId,
          ...projectData,
        },
      });
      return project;
    } catch (error) {
      throw new ServerError("Error creating project");
    }
  }

}
