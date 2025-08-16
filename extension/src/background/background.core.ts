import { fetchJson } from "../helpers/func";
import type {
  Enriched,
  IssuesPr,
  ProfileDataPayload,
  Releases,
  RepoApiData,
  Contributors,
  RepoBasicData,
  RepoData,
  RepoInfo,
  RepoTag,
  UrlType,
  RepoFolderData,
  RepoFileData,
} from "../types/data.type";
import { ApiEndPoint } from "../types/data.type";

const apiBaseUrl: string =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

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
    await fetch(`${apiBaseUrl}/${ApiEndPoint.PROFILE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("Background.core -> Send Profile data to backend successfully");
  } catch (err) {
    console.error("Failed to send data to backend. Error: ", err);
  }

  return data;
};

export const scrapeGTRepo = async (
  repoBasicData: RepoBasicData
): Promise<RepoData> => {
  const { owner, repoName } = repoBasicData;

  //? Fetch open issues (Limit 30)
  let openIssues: IssuesPr[] = [];
  try {
    const issuesRes = await fetchJson(
      `https://api.github.com/repos/${owner}/${repoName}/issues?state=open&per_page=30`
    );

    openIssues = issuesRes
      .filter((issue: any) => !issue.pull_request)
      .map((issue: any) => ({
        number: issue.number,
        title: issue.title,
        state: issue.state,
        labels: issue.labels.map((label: any) => label.name),
      }));
  } catch (err) {
    console.warn("Failed to fetch open issues", err);
  }

  //? Fetch Pull requests (Limit 30)
  let openPullRequests: IssuesPr[] = [];
  try {
    const prRes = await fetchJson(
      `https://api.github.com/repos/${owner}/${repoName}/pulls?state=open&per_page=30`
    );

    openPullRequests = prRes.map((pr: any) => ({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      labels: pr.labels.map((label: any) => label.name),
    }));
  } catch (err) {
    console.warn("Failed to fetch open pull requests", err);
  }

  //? Fetch latest 5 releases
  let releases: Releases[] = [];
  try {
    const releasesRes = await fetchJson(
      `https://api.github.com/repos/${owner}/${repoName}/releases?per_page=5`
    );

    if (Array.isArray(releasesRes)) {
      releases = releasesRes.map((release: any) => ({
        tag_name: release.tag_name,
        name: release.name,
        body: release.body,
        published_at: release.published_at,
        url: release.html_url,
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch latest releases", err);
  }

  //? Fetch top 10 contributors
  let contributors: Contributors[] = [];
  try {
    const contributorsRes = await fetchJson(
      `https://api.github.com/repos/${owner}/${repoName}/contributors?per_page=10`
    );

    if (Array.isArray(contributorsRes)) {
      contributors = contributorsRes.map((contri: any) => ({
        login: contri.lgoin,
        contributions: contri.contributions,
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch top 10 contributors", err);
  }

  //? Making finalize data
  const repoApiData: RepoApiData = {
    openIssues,
    openPullRequests,
    releases,
    contributors,
  };

  const data: RepoData = {
    info: `repo/${owner}/${repoName}`,
    repoBasicData: repoBasicData,
    repoApiData: repoApiData,
  };

  //? Send data to backend :
  try {
    await fetch(`${apiBaseUrl}/${ApiEndPoint.REPO}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("Background.core -> Send Repo data to backend successfully");
  } catch (err) {
    console.error("Failed to send repo enriched data to backend", err);
  }

  return data;
};

export const sendRepoFolderData = async (
  data: RepoFolderData
): Promise<boolean> => {
  try {
    await fetch(`${apiBaseUrl}/${ApiEndPoint.REPO_FOLDER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(
      "Background.core -> Send Repo Folder data to backend successfully"
    );
  } catch (err) {
    console.error("Failed to send repo folder data to backend", err);
    return false;
  }
  return true;
};

export const sendRepoFileData = async (
  data: RepoFileData
): Promise<boolean> => {
  try {
    await fetch(`${apiBaseUrl}/${ApiEndPoint.REPO_FILE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(
      "Background.core -> Send Repo File data to backend successfully"
    );
  } catch (err) {
    console.error("Failed to send repo file data to backend : ", err);
    return false;
  }
  return true;
};

const reservedPages = [
  "dashboard",
  "notifications",
  "settings",
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

const repoPage = [
  "issues",
  "pulls",
  "actions",
  "projects",
  "wiki",
  "security",
  "pulse",
  "settings",
];

const UrlToInfo = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== "github.com") return "";

    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    if (pathSegments.length === 1) {
      return `profile/${pathSegments[0]}`;
    } else if (
      pathSegments.length === 2 ||
      (pathSegments.length >= 3 && repoPage.includes(pathSegments[2]))
    ) {
      return `repo/${pathSegments[0]}/${pathSegments[1]}`;
    } else if (pathSegments.length >= 3) {
      return `repo/${pathSegments.join("/")}`;
    } else return "";
  } catch {
    return "";
  }
};

export const getGitHubPageType = (url: string): UrlType => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return "NONE";

    const pathParts = parsed.pathname.split("/").filter(Boolean);

    if (pathParts.length == 0) return "NONE";
    if (reservedPages.includes(pathParts[0])) return "NONE";

    if (pathParts.length === 1) return "PROFILE";
    if (
      pathParts.length === 2 ||
      (pathParts.length >= 3 && repoPage.includes(pathParts[2]))
    )
      return "REPO";
    if (pathParts.length >= 3 && pathParts[2] === "tree")
      return "REPO_IN_Folder";
    if (pathParts.length >= 3 && pathParts[2] === "blob") return "REPO_IN_File";

    return "NONE";
  } catch {
    return "NONE";
  }
};

export const isDataStorable = async (url: string): Promise<boolean> => {
  let flag: boolean = true;
  const info = UrlToInfo(url);
  console.log(
    "Background.core -> Logging the info for checking data storable or not : ",
    info
  );

  try {
    const res = await fetch(`${apiBaseUrl}/${ApiEndPoint.CHECK_DATA}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    });
    flag = await res.json();
  } catch (err) {
    console.error("Failed to check data exist or not in vector : ", err);
    return true;
  }
  return flag;
};
