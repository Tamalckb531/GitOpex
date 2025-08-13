import { Context } from "hono";
import { handleEnrichedData, handleInvoking } from "../services/insert.service";
import { Enriched, Query } from "../types/data.type";

export const insertDataProfile = async (c: Context) => {
  const enriched: Enriched = await c.req.json();
  const userId: string | null = c.get("userId");
  const apiKey: string = c.env.AI_API_KEY;
  const encryptKey: string = c.env.ENCRYPTION_KEY;
  const pineconeKey: string = c.env.PINECONE_API_KEY;
  const db_url: string = c.env.DATABASE_URL;

  await handleEnrichedData(
    enriched,
    userId,
    apiKey,
    encryptKey,
    pineconeKey,
    db_url
  );

  return c.json({ status: "ok" });
};
export const insertDataRepo = async (c: Context) => {
  const enriched: Enriched = await c.req.json();
  const userId: string | null = c.get("userId");
  const apiKey: string = c.env.AI_API_KEY;
  const encryptKey: string = c.env.ENCRYPTION_KEY;
  const pineconeKey: string = c.env.PINECONE_API_KEY;
  const db_url: string = c.env.DATABASE_URL;

  await handleEnrichedData(
    enriched,
    userId,
    apiKey,
    encryptKey,
    pineconeKey,
    db_url
  );

  return c.json({ status: "ok" });
};
export const insertDataRepoFile = async (c: Context) => {
  const enriched: Enriched = await c.req.json();
  const userId: string | null = c.get("userId");
  const apiKey: string = c.env.AI_API_KEY;
  const encryptKey: string = c.env.ENCRYPTION_KEY;
  const pineconeKey: string = c.env.PINECONE_API_KEY;
  const db_url: string = c.env.DATABASE_URL;

  await handleEnrichedData(
    enriched,
    userId,
    apiKey,
    encryptKey,
    pineconeKey,
    db_url
  );

  return c.json({ status: "ok" });
};
export const insertDataRepoFolder = async (c: Context) => {
  const enriched: Enriched = await c.req.json();
  const userId: string | null = c.get("userId");
  const apiKey: string = c.env.AI_API_KEY;
  const encryptKey: string = c.env.ENCRYPTION_KEY;
  const pineconeKey: string = c.env.PINECONE_API_KEY;
  const db_url: string = c.env.DATABASE_URL;

  await handleEnrichedData(
    enriched,
    userId,
    apiKey,
    encryptKey,
    pineconeKey,
    db_url
  );

  return c.json({ status: "ok" });
};
export const checker = async (c: Context) => {
  const enriched: Enriched = await c.req.json();
  const userId: string | null = c.get("userId");
  const apiKey: string = c.env.AI_API_KEY;
  const encryptKey: string = c.env.ENCRYPTION_KEY;
  const pineconeKey: string = c.env.PINECONE_API_KEY;
  const db_url: string = c.env.DATABASE_URL;

  await handleEnrichedData(
    enriched,
    userId,
    apiKey,
    encryptKey,
    pineconeKey,
    db_url
  );

  return c.json({ status: "ok" });
};

export const invokeAgent = async (c: Context) => {
  const query: Query = await c.req.json();
  const userId: string | null = c.get("userId");
  const apiKey: string = c.env.AI_API_KEY;
  const pineconeKey: string = c.env.PINECONE_API_KEY;
  const tvKey: string = c.env.TV_API_KEY;
  const encryptKey: string = c.env.ENCRYPTION_KEY;
  const db_url: string = c.env.DATABASE_URL;

  const result = await handleInvoking(
    query.question,
    query.info,
    userId,
    apiKey,
    pineconeKey,
    tvKey,
    encryptKey,
    db_url
  );

  return c.json({ status: "ok", result });
};
