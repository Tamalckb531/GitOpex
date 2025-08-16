import { Context } from "hono";
import {
  handleEnrichedData,
  handleInvoking,
  storable,
} from "../services/insert.service";
import {
  Enriched,
  Query,
  RepoData,
  RepoFileData,
  RepoFolderData,
  UrlType,
} from "../types/data.type";

export const insertData = (type: UrlType) => {
  return async (c: Context) => {
    const data: Enriched | RepoData | RepoFileData | RepoFolderData =
      await c.req.json();
    const userId: string | null = c.get("userId");
    const apiKey: string = c.env.AI_API_KEY;
    const encryptKey: string = c.env.ENCRYPTION_KEY;
    const pineconeKey: string = c.env.PINECONE_API_KEY;
    const db_url: string = c.env.DATABASE_URL;

    console.log(
      "Got the data from extension : ",
      !!data,
      " with info : ",
      data.info
    );

    await handleEnrichedData(
      data,
      type,
      userId,
      apiKey,
      encryptKey,
      pineconeKey,
      db_url
    );

    return c.json({ status: "ok" });
  };
};

export const checker = async (c: Context) => {
  const info: string = await c.req.json();
  const pineconeKey: string = c.env.PINECONE_API_KEY;

  const isStorable: boolean = await storable(info, pineconeKey);

  return c.json(isStorable);
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
