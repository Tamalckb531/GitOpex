import { app } from "../agents";
import { Constants, Enriched, VectorData } from "../types/data.type";
import { storeEmbeddings } from "../vector/embed";
import { PrismaClient } from "../generated/prisma";
import { decryptApiKey } from "../libs/encryptions";
import { HTTPException } from "hono/http-exception";
import { Pinecone } from "@pinecone-database/pinecone";

const storable = async (
  info: string,
  pineconeKey: string
): Promise<boolean> => {
  const pinecone = new Pinecone({ apiKey: pineconeKey });
  const indexName = Constants.GITOPEX_INDEX;
  const index = pinecone.Index(indexName);

  //? Create index if it doesn't exist
  const indexList = await pinecone.listIndexes();
  const indexNames = indexList.indexes?.map((i) => i.name);
  let queryResult;

  try {
    if (indexNames && !indexNames.includes(indexName)) {
      await pinecone.createIndex({
        name: indexName,
        dimension: 1536,
        metric: "cosine",
        spec: {
          serverless: {
            region: "us-east-1",
            cloud: "aws",
          },
        },
      });

      let isReady = false;
      while (!isReady) {
        const updatedList = await pinecone.listIndexes();
        isReady =
          updatedList.indexes?.some((i) => i.name === indexName) || false;
        if (!isReady) await new Promise((res) => setTimeout(res, 3000));
      }
    }

    queryResult = await index.query({
      topK: 1,
      vector: Array(1536).fill(0),
      filter: {
        info: { $eq: info },
      },
      includeMetadata: true,
    });
  } catch (err: any) {
    console.log(err);
  }

  const match = queryResult && (queryResult.matches?.[0] as VectorData);

  if (!match) return true;

  const storeDate = new Date(match.metadata.date || "");
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return storeDate < oneWeekAgo;
};

const deleteEmbeddings = async (info: string, pineconeKey: string) => {
  const pinecone = new Pinecone({ apiKey: pineconeKey });
  const indexName = Constants.GITOPEX_INDEX;
  const index = pinecone.Index(indexName);

  await index.deleteMany({
    filter: {
      info: { $eq: info },
    },
  });
};

const prisma = new PrismaClient();

const stringifyEnriched = (enriched: Enriched): string[] => {
  const { userData, allRepos, activeRepos, popularOSRepos } = enriched;

  const profileText = `Name: ${userData.name}, Username: ${userData.username}, Bio: ${userData.bio}, Location: ${userData.location}, Website: ${userData.website}`;

  const repoTexts = allRepos.map((repo) => {
    return `Repository: ${repo.name}, Description: ${
      repo.description
    }, Language: ${repo.language}, Stars: ${
      repo.stargazers_count
    }, Topics: ${repo.topics?.join(", ")}`;
  });

  const activeRepoTexts = activeRepos.map((repo) => {
    return `Active Repository: ${repo.name}, Description: ${
      repo.description
    }, Language: ${repo.language}, Stars: ${
      repo.stargazers_count
    }, Topics: ${repo.topics?.join(", ")}`;
  });

  const popularOsTexts = popularOSRepos.map((repo) => {
    return `Popular Open Source Repo: ${repo.name}, Description: ${
      repo.description
    }, Language: ${repo.language}, Stars: ${
      repo.stargazers_count
    }, Topics: ${repo.topics?.join(", ")}`;
  });

  return [profileText, ...repoTexts, ...activeRepoTexts, ...popularOsTexts];
};

export const handleEnrichedData = async (
  enriched: Enriched,
  userId: string | null,
  key: string,
  encryptKey: string,
  pineconeKey: string
) => {
  const isStorable: boolean = await storable(enriched.info, pineconeKey);
  if (!isStorable) return;
  await deleteEmbeddings(enriched.info, pineconeKey);
  const docs = stringifyEnriched(enriched);
  let apiKey: string = key;
  try {
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          apiKey: true,
        },
      });
      if (user?.apiKey) {
        apiKey = decryptApiKey(user.apiKey, encryptKey);
      }
    }
  } catch (e: any) {
    throw new HTTPException(500, {
      message: e.message || "Error occurred while getting the apiKey of user",
    });
  }
  await storeEmbeddings(docs, apiKey, enriched.info, pineconeKey);
};

export const handleInvoking = async (
  query: string,
  userId: string | null,
  key: string,
  encryptKey: string
): Promise<string> => {
  let apiKey: string = key;

  try {
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          apiKey: true,
        },
      });
      if (user?.apiKey) {
        apiKey = decryptApiKey(user.apiKey, encryptKey);
      }
    }
  } catch (e: any) {
    throw new HTTPException(500, {
      message: e.message || "Error occurred while getting the apiKey of user",
    });
  }
  const output = await app.invoke({ question: query, apiKey });
  return output.generation;
};
