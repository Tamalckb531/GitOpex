import { Context } from "hono";
import { handleEnrichedData, handleInvoking } from "../services/insert.service";
import { Enriched } from "../types/data.type";

export const insertData = async (c: Context) => {
  const enriched: Enriched = await c.req.json();

  await handleEnrichedData(enriched);

  return c.json({ status: "ok" });
};

export const invokeAgent = async (c: Context) => {
  const query: string = await c.req.json();

  const result = await handleInvoking(query);

  return c.json({ status: "ok", result });
};
