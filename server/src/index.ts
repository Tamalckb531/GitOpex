import { Hono } from "hono";
import dataRoute from "./routes/data.route";

const app = new Hono();

app.get("/health", (c) => {
  return c.json({ message: "server is healthy" });
});

app.route("/api/data", dataRoute);

export default app;
