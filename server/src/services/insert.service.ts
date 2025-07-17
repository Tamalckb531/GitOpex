import { app } from "../agents";
import { Enriched } from "../types/data.type";
import { storeEmbeddings } from "../vector/embed";
import { PrismaClient } from "../generated/prisma";
import { decryptApiKey } from "../libs/encryptions";
import { HTTPException } from "hono/http-exception";

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
  encryptKey: string
) => {
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
  await storeEmbeddings(docs, apiKey);
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
