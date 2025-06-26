import { Hono } from "hono";
import dataRoute from "./routes/data.route";
import { cors } from "hono/cors";

const app = new Hono();

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

export default app;
