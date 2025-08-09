import { parseCountString } from "../helpers/func";
import type {
  Enriched,
  FileTree,
  ProfileDataPayload,
  RepoBasicData,
  RepoInfo,
  RepoTag,
  UrlType,
} from "../types/data.type";

export const isGithubUrl = (url: string): boolean => {
  return url.includes("github.com");
};

export const slimRepos = async (
  repo: any,
  username: string
): Promise<RepoInfo> => {
  const langRes = await fetch(
    `https://api.github.com/repos/${username}/${repo.name}/languages`
  );

  //? Build language array
  const langData = await langRes.json();
  const languagesArray = Object.keys(langData);

  //? Build tags array
  const tags: RepoTag[] = [];
  if (repo.open_issues_count > 0) tags.push("open_issues");
  if (repo.license > 0) tags.push("open_source");
  if (repo.forks > 0) tags.push("can_fork");
  const popularityScore =
    repo.stargazers_count + repo.forks + repo.open_issues_count;
  if (popularityScore > 1000) tags.push("popular");
  if (!repo.private) tags.push("public");

  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    size: repo.size,
    stargazers_count: repo.stargazers_count,
    watchers_count: repo.watchers_count,
    language: languagesArray,
    open_issues_count: repo.open_issues_count,
    license: repo.license ? { name: repo.license.name } : null,
    forks: repo.forks,
    open_issues: repo.open_issues,
    topics: repo.topics,
    updated_at: repo.updated_at,
    has_issues: repo.has_issues,
    html_url: repo.html_url,
    tag: tags,
  };
};

export const scrapeGTProfile = async (
  userData: ProfileDataPayload
): Promise<Enriched> => {
  const username = userData.username;

  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&type=owner&sort=updated`
  );
  const repos = await reposRes.json();

  const topRepos = repos.slice(0, 7);

  const enrichedRepos = await Promise.all(
    topRepos.map((repo: any) => slimRepos(repo, username))
  );

  const data = {
    info: `profile/${username}`,
    userData,
    allRepos: enrichedRepos,
  };

  //? Send to backend server
  try {
    await fetch("http://localhost:8787/api/data/rag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(data);
  } catch (err) {
    console.error("Failed to send data to backend");
  }

  return data;
};

export const scrapeGTRepo = async (repoData: RepoBasicData): Promise<any> => {
  return repoData;
};

const reservedPages = [
  "dashboard",
  "notifications",
  "settings",
  "pulls",
  "issues",
  "marketplace",
  "explore",
  "apps",
  "topics",
  "collections",
  "events",
  "sponsors",
  "codespaces",
  "copilot",
  "discussion",
  "projects",
];

export const getGitHubPageType = (url: string): UrlType => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return "NONE";

    const pathParts = parsed.pathname.split("/").filter(Boolean);

    if (pathParts.length == 0) return "NONE";
    if (reservedPages.includes(pathParts[0])) return "NONE";

    if (pathParts.length === 1) return "PROFILE";
    if (pathParts.length === 2) return "REPO";
    if (pathParts.length >= 3 && pathParts[2] === "tree")
      return "REPO_IN_Folder";
    if (pathParts.length >= 3 && pathParts[2] === "blob") return "REPO_IN_File";

    return "NONE";
  } catch {
    return "NONE";
  }
};
