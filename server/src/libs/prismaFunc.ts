import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const getPrisma = (db_url: string) => {
  const prisma = new PrismaClient({
    datasourceUrl: db_url,
  }).$extends(withAccelerate());

  return prisma;
};
