import { parseCountString } from "../helpers/func";
import type {
  FileTree,
  ProfileDataPayload,
  RepoBasicData,
  RepoFolderData,
} from "../types/data.type";

//? Get basic profile data
export const getProfileData = (): ProfileDataPayload => {
  const username: string =
    document
      .querySelector("span.p-nickname")
      ?.textContent?.trim()
      .split("\n")[0] || "";

  const name: string =
    document.querySelector("span.p-name")?.textContent?.trim() || "";

  const bio: string =
    document.querySelector("div.p-note")?.textContent?.trim() || "";

  const location: string =
    document
      .querySelector('li[itemprop="homeLocation"] span')
      ?.textContent?.trim() || "";

  const website: string =
    document.querySelector('li[itemprop="url"] a')?.getAttribute("href") || "";

  const repoCount: string =
    document
      .querySelector('a[href$="?tab=repositories"] span.Counter')
      ?.textContent?.trim() || "";

  const pinnedRepos: string[] = [...document.querySelectorAll("span.repo")]
    .map((el) => el.textContent?.trim())
    .filter(Boolean) as string[];

  return {
    username,
    name,
    bio,
    location,
    website,
    repoCount,
    pinnedRepos,
  };
};

export const getRepoDataFromDOM = (): RepoBasicData => {
  const [owner, repoName] = window.location.pathname.slice(1).split("/");

  //? Get description
  const repoDescriptionElem =
    document.querySelector("meta[name='description']") ||
    document.querySelector("div[data-test-selector='repo-description']");

  const repoDescription =
    repoDescriptionElem?.getAttribute("content") ||
    repoDescriptionElem?.textContent?.trim() ||
    null;

  //? Get start + forks + watch
  const starsEl = document.querySelector("#repo-stars-counter-star");
  const forksEl = document.querySelector("#repo-network-counter");
  const watchersEl = document.querySelector(
    `a[href='/${owner}/${repoName}/watchers']`
  );

  const starsCount = parseCountString(starsEl?.textContent || null);
  const forkCount = parseCountString(forksEl?.textContent || null);
  const watchersCount = parseCountString(watchersEl?.textContent || null);

  //? Get license
  let license: string | null = null;
  const licenseNode = document.querySelector('a[href$="/LICENSE"] span');
  if (licenseNode) {
    license = licenseNode.textContent?.trim() || null;
  } else {
    const licenseAlt = Array.from(
      document.querySelectorAll("a[href*='/blob/']")
    ).find((el) => el.textContent?.toLowerCase().includes("license"));
    if (licenseAlt) license = licenseAlt.textContent?.trim() || null;
  }

  //? Branch and readme
  const branchBtn = document.querySelector(
    'button[data-hotkey="w"] span.css-truncate-target'
  );
  const defaultBranch = branchBtn?.textContent?.trim() || "main";

  const readmeEl = document.querySelector(".markdown-body");
  let readmeText = null;
  if (readmeEl) {
    readmeText = readmeEl.textContent?.trim() || null;
  }

  //? File and Folder structure
  const fileTree: FileTree = [];
  const items = document.querySelectorAll(".react-directory-row"); // each file/folder line

  if (items.length === 0) {
    // Fall back for old UI
    const oldItems = document.querySelectorAll(
      'ul[aria-label="Repository"] > li'
    );

    oldItems.forEach((el) => {
      const nameEl = el.querySelector("a.js-navigation-open");
      const iconEl = el.querySelector("svg.octicon");

      if (nameEl) {
        const name = nameEl.textContent?.trim() || "";

        const type =
          iconEl?.getAttribute("aria-label") === "Directory" ||
          iconEl?.classList.contains("octicon-file-directory")
            ? "dir"
            : "file";
        fileTree.push({ name, type });
      }
    });
  } else {
    items.forEach((row) => {
      const link = row.querySelector("a.Link--primary");
      if (!link) return;
      const name = link.textContent?.trim() || "";

      let type: "file" | "dir" = "file";
      const dirIcon = row.querySelector("svg.icon-directory");

      if (dirIcon) type = "dir";

      fileTree.push({ name, type });
    });
  }

  //? Get Open issues and Pr count
  const issuesBadge = document.querySelector("#issues-repo-tab-count");
  const openIssuesCount = parseCountString(issuesBadge?.textContent || "");

  const prsBadge = document.querySelector("#pull-requests-repo-tab-count");
  const openPullReqCount = parseCountString(prsBadge?.textContent || "");

  //? Get Repo topics and last update
  const topicElements = document.querySelectorAll(".topic-tag");
  const topics: string[] = Array.from(topicElements)
    .map((el) => el.textContent?.trim() || "")
    .filter(Boolean);

  let lastUpdated: string | null = null;
  const timeEl = document.querySelector("relative-time");
  if (timeEl) lastUpdated = timeEl.getAttribute("datetime") || null;

  const data: RepoBasicData = {
    owner,
    repoName,
    repoDescription,
    starsCount,
    forkCount,
    watchersCount,
    license,
    defaultBranch,
    readmeText,

    fileTree,

    openIssuesCount,
    openPullReqCount,

    topics,
    lastUpdated,
  };

  return data;
};

export const getRepoFolderDataFromDOM = (): RepoFolderData => {
  const [owner, repoName, ...otherPaths] = window.location.pathname
    .slice(1)
    .split("/");

  //? Get info, foldername and path
  const folderName = otherPaths[otherPaths.length - 1];

  let path: string = `${repoName}`;
  for (let i = 0; i < otherPaths.length; i++) {
    path += `/` + otherPaths[i];
  }

  const info = `repo/${owner}/${path}`;

  //? Get readme text
  let readmeText: string | null = null;
  const readmeDiv = document.querySelector("#readme");
  if (readmeDiv) {
    const contentDiv = readmeDiv.children[1];
    readmeText = contentDiv.textContent.replace(/\n/g, " ").trim();
  }

  //? File and Folder structure
  const fileTree: FileTree = [];
  const items = document.querySelectorAll(".react-directory-row"); // each file/folder line

  if (items.length === 0) {
    // Fall back for old UI
    const oldItems = document.querySelectorAll(
      'ul[aria-label="Repository"] > li'
    );

    oldItems.forEach((el) => {
      const nameEl = el.querySelector("a.js-navigation-open");
      const iconEl = el.querySelector("svg.octicon");

      if (nameEl) {
        const name = nameEl.textContent?.trim() || "";

        const type =
          iconEl?.getAttribute("aria-label") === "Directory" ||
          iconEl?.classList.contains("octicon-file-directory")
            ? "dir"
            : "file";
        fileTree.push({ name, type });
      }
    });
  } else {
    items.forEach((row) => {
      const link = row.querySelector("a.Link--primary");
      if (!link) return;
      const name = link.textContent?.trim() || "";

      let type: "file" | "dir" = "file";
      const dirIcon = row.querySelector("svg.icon-directory");

      if (dirIcon) type = "dir";

      fileTree.push({ name, type });
    });
  }

  const repoFolderData: RepoFolderData = {
    info,
    folderName,
    path,
    readmeText,
    fileTree,
  };

  return repoFolderData;
};

export const getRepoFileDataFromDOM = () => {};
