import { formatDatetime } from "./../libs/utils";
import { app } from "../agents";
import {
  Constants,
  Enriched,
  FileTree,
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

export const storable = async (
  userInfo: string,
  pineconeKey: string
): Promise<boolean> => {
  const indexName = Constants.GITOPEX_INDEX;

  const { index } = createPineconeClient(pineconeKey, indexName);

  let queryResult;
  console.log("Data running for : ", userInfo);

  try {
    queryResult = await index.query({
      topK: 1,
      vector: Array(768).fill(0),
      filter: { info: userInfo },
      includeMetadata: true,
    });
  } catch (error: any) {
    throw new HTTPException(500, {
      message: error.message || "Error occurred while query embeddings",
    });
  }

  const match = queryResult && (queryResult.matches?.[0] as VectorData);

  if (!match) return true;

  const storeDate = new Date(match.metadata.date || "");
  if (isNaN(storeDate.getTime())) return true;
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  if (storeDate < oneWeekAgo) await deleteEmbeddings(userInfo, pineconeKey);

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
  let profileText: string = "";
  let repoTexts: string[] = [];

  try {
    profileText = `Name: ${userData.name}, Username: ${
      userData.username
    }, Bio: ${userData.bio}, Location: ${userData.location}, Website: ${
      userData.website
    }, total repository: ${
      userData.repoCount
    }, pinned repository : ${userData.pinnedRepos?.join(", ")}`;

    repoTexts = allRepos.map((repo) => {
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
  } catch (err: any) {
    console.log("Error occurred in stringifyProfile: ", err);
  }

  return [profileText, ...repoTexts];
};

const stringifyRepo = (repo: RepoData): string[] => {
  const { repoBasicData, repoApiData } = repo;

  let basicInfo: string = "";
  let readmeText: string = "";
  let fileTreeText: string = "";
  let openIssuesText: string = "";
  let openPrsText: string = "";
  let releasesSummaryText: string = "";
  let contributorsSummaryText: string = "";
  try {
    //! Basic info summery
    basicInfo = `Repository: ${repoBasicData.owner}/${repoBasicData.repoName}.
Description: ${repoBasicData.repoDescription || "No description provided."}
Stars: ${repoBasicData.starsCount}, Forks: ${
      repoBasicData.forkCount
    }, Watchers: ${repoBasicData.watchersCount}.
License: ${repoBasicData.license || "No license specified"}.
Default branch: ${repoBasicData.defaultBranch},
Open issues: ${repoBasicData.openIssuesCount}, Open pull requests: ${
      repoBasicData.openPullReqCount
    }.
Topics: ${repoBasicData.topics.join(", ") || "None"}.
Last updated: ${formatDatetime(repoBasicData.lastUpdated || "Unknown")}.`;

    //! Readme text separately
    readmeText = repoBasicData.readmeText
      ? repoBasicData.readmeText.replace(/\s*\n\s*/g, " ").trim()
      : "No Readme available";

    //! File Tree summery
    const filterTreeItems = repoBasicData.fileTree.map(
      (item) => `${item.type === "dir" ? "Directory" : "File"}:${item.name}`
    );

    fileTreeText = `Folder Structure : ${
      filterTreeItems.length > 0
        ? filterTreeItems.join(", ")
        : "No files or folders listed"
    }`;

    //! Open issues summary
    const openIssuesSummary = repoApiData.openIssues
      .map(
        (issue) =>
          `#${issue.number} [${issue.state}] ${issue.title} (Labels: ${
            issue.labels.join(", ") || "None"
          })`
      )
      .join(" | ");

    openIssuesText = `Open Issues: ${openIssuesSummary || "No Open Issues"}.`;

    //! Open prs summary
    const openPrsSummary = repoApiData.openPullRequests
      .map(
        (pr) =>
          `#${pr.number} [${pr.state}] ${pr.title} (Labels: ${
            pr.labels.join(", ") || "None"
          })`
      )
      .join(" | ");

    openPrsText = `Open Pull Requests: ${
      openPrsSummary || "No Open Pull Requests"
    }.`;

    //! Releases summary
    const ReleasesSummary = repoApiData.releases
      .map(
        (release) =>
          `${release.tag_name} - ${release.name} (Published: ${formatDatetime(
            release.published_at || "Unknown"
          )}) [url: ${release.url}]`
      )
      .join(" | ");

    releasesSummaryText = `Recent Releases: ${
      ReleasesSummary || "No releases available"
    }.`;

    //! Contributors summary
    const ContributorsSummary = repoApiData.contributors
      .map(
        (contributor) =>
          `${contributor.login} - ${contributor.contributions} contributions`
      )
      .join(" | ");

    contributorsSummaryText = `Top Contributors: ${
      ContributorsSummary || "No contributors."
    }.`;
  } catch (err: any) {
    console.log("Error occurred in stringifyRepo: ", err);
  }
  return [
    basicInfo,
    readmeText,
    fileTreeText,
    openIssuesText,
    openPrsText,
    releasesSummaryText,
    contributorsSummaryText,
  ];
};

const stringifyRepoFile = (file: RepoFileData): string[] => {
  let fileText: string = "";
  try {
    fileText = `File Name : ${file.fileName}, located at : ${
      file.path
    }, content or code in that file : ${file.content || "No content"}`;
  } catch (err: any) {
    console.log("Error occurred in stringifyRepoFile: ", err);
  }
  return [fileText];
};

const stringifyRepoFolder = (folder: RepoFolderData): string[] => {
  let folderInfoText: string = "";
  let folderReadmeText: string = "";
  try {
    const filterTreeItems = folder.fileTree.map(
      (item) => `${item.type === "dir" ? "Directory" : "File"}:${item.name}`
    );

    const fileTreeText = `Folder Structure : ${
      filterTreeItems.length > 0
        ? filterTreeItems.join(", ")
        : "No files or folders listed"
    }`;

    folderInfoText = `Folder name : ${folder.folderName}, Folder path: ${folder.path}, Also ${fileTreeText}`;

    folderReadmeText = `Folder ${folder.folderName} Readme text : ${
      folder.readmeText
        ? folder.readmeText.replace(/\s*\n\s*/g, " ").trim()
        : "No Readme available"
    }`;
  } catch (err: any) {
    console.log("Error occurred in stringifyRepoFolder: ", err);
  }
  return [folderInfoText, folderReadmeText];
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

    console.log("Data is storable and got the docs : ", docs);

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
    console.log("Vector data saved in pinecone");
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
