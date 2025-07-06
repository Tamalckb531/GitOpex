import { Context } from "hono";
import { handleEnrichedData } from "../services/insert.service";
import { Enriched } from "../types/data.type";

export const insertData = async (c: Context) => {
  const enriched: Enriched = await c.req.json();

  await handleEnrichedData(enriched);

  return c.json({ status: "ok" });
};
