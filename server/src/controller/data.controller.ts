import { Context } from "hono";
import { handleEnrichedData, handleInvoking } from "../services/insert.service";
import { Enriched, Query } from "../types/data.type";

export const insertData = async (c: Context) => {
  const enriched: Enriched = await c.req.json();
  const userId: string | null = c.get("userId");
  const apiKey: string = c.env.AI_API_KEY;
  const encryptKey: string = c.env.ENCRYPTION_KEY;

  await handleEnrichedData(enriched, userId, apiKey, encryptKey);

  return c.json({ status: "ok" });
};

export const invokeAgent = async (c: Context) => {
  const query: Query = await c.req.json();
  const userId: string | null = c.get("userId");
  const apiKey: string = c.env.AI_API_KEY;
  const encryptKey: string = c.env.ENCRYPTION_KEY;

  const result = await handleInvoking(
    query.question,
    userId,
    apiKey,
    encryptKey
  );

  return c.json({ status: "ok", result });
};
