import { Hono } from "hono";
import dataRoute from "./routes/data.route";
import { cors } from "hono/cors";

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

app.route("/api/data", dataRoute);
app.route("/api/auth", dataRoute);

export default app;
