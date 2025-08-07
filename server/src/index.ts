import { Hono } from "hono";
import dataRoute from "./routes/data.route";
import authRoute from "./routes/auth.route";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

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

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }
  return c.json({ message: "Internal Server Error" }, 500);
});

app.get("/health", (c) => {
  return c.json({ message: "server is healthy" });
});

app.route("/api/data", dataRoute);
app.route("/api/auth", authRoute);

export default app;
