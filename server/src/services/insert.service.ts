import { formatDatetime } from "./../libs/utils";
import { app } from "../agents";
import {
  Constants,
  Enriched,
  RepoData,
  RepoFileData,
  RepoFolderData,
  UrlType,
  VectorData,
} from "../types/data.type";
import { storeEmbeddings } from "../vector/embed";
import { decryptApiKey } from "../libs/encryptions";
import { HTTPException } from "hono/http-exception";
import { Pinecone } from "@pinecone-database/pinecone";
import { getPrisma } from "../libs/prismaFunc";
import { createPineconeClient } from "../vector/client";

const storable = async (
  info: string,
  pineconeKey: string
): Promise<boolean> => {
  const indexName = Constants.GITOPEX_INDEX;

  const { index } = createPineconeClient(pineconeKey, indexName);

  let queryResult;
  try {
    queryResult = await index.query({
      topK: 1,
      vector: Array(768).fill(0),
      filter: {
        info: { $eq: info },
      },
      includeMetadata: true,
    });
  } catch (error: any) {
    throw new HTTPException(500, {
      message: error.message || "Error occurred while deleting embeddings",
    });
  }

  const match = queryResult && (queryResult.matches?.[0] as VectorData);

  if (!match) return true;

  const storeDate = new Date(match.metadata.date || "");
  if (isNaN(storeDate.getTime())) return true;
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  if (storeDate < oneWeekAgo) await deleteEmbeddings(info, pineconeKey);

  return storeDate < oneWeekAgo;
};

const deleteEmbeddings = async (info: string, pineconeKey: string) => {
  const pinecone = new Pinecone({ apiKey: pineconeKey });
  const indexName = Constants.GITOPEX_INDEX;
  const index = pinecone.Index(indexName);

  try {
    await index.deleteMany({
      filter: {
        info: { $eq: info },
      },
    });
  } catch (error: any) {
    throw new HTTPException(500, {
      message: error.message || "Error occurred while deleting embeddings",
    });
  }
};

const stringifyProfile = (enriched: Enriched): string[] => {
  const { userData, allRepos } = enriched;

  const profileText = `Name: ${userData.name}, Username: ${
    userData.username
  }, Bio: ${userData.bio}, Location: ${userData.location}, Website: ${
    userData.website
  }, total repository: ${
    userData.repoCount
  }, pinned repository : ${userData.pinnedRepos?.join(", ")}`;

  const repoTexts = allRepos.map((repo) => {
    return `Repository: ${repo.name}, Full name: ${
      repo.full_name
    }, Description: ${repo.description},  Size: ${
      repo.size
    } Kilobyte, Language: ${repo.language?.join(", ")}, Stars: ${
      repo.stargazers_count
    }, Watchers : ${repo.watchers_count}, Total Open issues: ${
      repo.open_issues_count
    }, License : ${repo.license?.name}, Total Fork : ${
      repo.forks
    }, topics : ${repo.topics?.join(", ")}, Last update : ${formatDatetime(
      repo.updated_at || " "
    )}, Link to github : ${repo.html_url}, Tags : ${repo.tag?.join(", ")}`;
  });

  return [profileText, ...repoTexts];
};

const stringifyRepo = (repo: RepoData): string[] => {
  return [""];
};
const stringifyRepoFile = (file: RepoFileData): string[] => {
  return [""];
};
const stringifyRepoFolder = (folder: RepoFolderData): string[] => {
  return [""];
};

export const handleEnrichedData = async (
  data: Enriched | RepoData | RepoFileData | RepoFolderData,
  type: UrlType,
  userId: string | null,
  key: string,
  encryptKey: string,
  pineconeKey: string,
  db_url: string
) => {
  try {
    const prisma = getPrisma(db_url);
    const isStorable: boolean = await storable(data.info, pineconeKey);
    if (!isStorable) return;

    let docs: string[];
    switch (type) {
      case "PROFILE":
        docs = stringifyProfile(data as Enriched);
        break;
      case "REPO":
        docs = stringifyRepo(data as RepoData);
        break;
      case "REPO_IN_File":
        docs = stringifyRepoFile(data as RepoFileData);
        break;
      case "REPO_IN_Folder":
        docs = stringifyRepoFolder(data as RepoFolderData);
        break;
      default:
        throw new Error("Unsupported Url");
    }

    let apiKey: string = key;
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

    await storeEmbeddings(docs, apiKey, data.info, pineconeKey);
  } catch (e: any) {
    throw new HTTPException(500, {
      message: e.message || "Error occurred while getting the apiKey of user",
    });
  }
};

export const handleInvoking = async (
  query: string,
  info: string,
  userId: string | null,
  key: string,
  pineconeKey: string,
  tvKey: string,
  encryptKey: string,
  db_url: string
): Promise<string> => {
  const prisma = getPrisma(db_url);
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
  const output = await app.invoke({
    question: query,
    apiKey,
    pineconeKey,
    tvKey,
    info,
  });
  return output.generation;
};

//? inspect
