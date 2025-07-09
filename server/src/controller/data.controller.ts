import { Context } from "hono";
import { handleEnrichedData, handleInvoking } from "../services/insert.service";
import { Enriched, Query } from "../types/data.type";

export const insertData = async (c: Context) => {
  const enriched: Enriched = await c.req.json();

  await handleEnrichedData(enriched);

  return c.json({ status: "ok" });
};

export const invokeAgent = async (c: Context) => {
  const query: Query = await c.req.json();

  const result = await handleInvoking(query.question);

  return c.json({ status: "ok", result });
};
