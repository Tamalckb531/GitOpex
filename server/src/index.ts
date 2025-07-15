import { Hono } from "hono";
import dataRoute from "./routes/data.route";
import { cors } from "hono/cors";
import { PrismaClient } from "@prisma/client/edge";
import type { PrismaClient as PrismaType } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { getPrisma } from "./libs/prismaFunc";

// ?Create the main Hono app
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

//? CORS policy
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/health", (c) => {
  return c.json({ message: "server is healthy" });
});

app.get("/api/user", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  const user = await prisma.user.create({
    data: {
      name: "Jon Doe",
      email: `jon${Math.floor(Math.random() * 1000)}@example.com`,
    },
  });

  return c.json(user);
});

app.route("/api/data", dataRoute);

export default app;
