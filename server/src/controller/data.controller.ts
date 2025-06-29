import { Context } from "hono";
import { handleEnrichedData } from "../services/insert.service";

export const insertData = async (c: Context) => {
  const enriched = await c.req.json();

  await handleEnrichedData(enriched);

  return c.json(true);
};
