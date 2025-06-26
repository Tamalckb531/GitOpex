import { Context } from "hono";

export const insertData = async (c: Context) => {
  const enriched = await c.req.json();

  console.log("Received data from extension:", enriched);
  return c.json(true);
};
