export type RepoTag =
  | "open_issues"
  | "open_source"
  | "can_fork"
  | "popular"
  | "public";

export interface RepoInfo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string[] | null;
  open_issues_count: number;
  license: { name: string } | null;
  forks: number;
  open_issues: number;
  topics: string[];
  updated_at: string;
  has_issues: boolean;
  html_url: string;
  tag: RepoTag[];
}

export interface ProfileDataPayload {
  username: string;
  name: string;
  bio: string;
  location: string;
  website: string;
  repoCount: string;
  pinnedRepos: string[];
}

export type Enriched = {
  info: string;
  userData: ProfileDataPayload;
  allRepos: RepoInfo[];
};

export type FileTree = Array<{
  name: string;
  type: "file" | "dir";
}>;

export interface RepoBasicData {
  owner: string;
  repoName: string;
  repoDescription: string | null;
  starsCount: number;
  forkCount: number;
  watchersCount: number;
  license: string | null;
  defaultBranch: string;
  readmeText: string | null;

  fileTree: FileTree;

  openIssuesCount: number;
  openPullReqCount: number;

  topics: string[];
  lastUpdated: string | null;
}

export type RepoContents = {
  name: string;
  type: string;
  path: string;
};
export type IssuesPr = {
  number: number;
  title: string;
  state: string;
  labels: string[];
};
export type Releases = {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  url: string;
};
export type Contributors = {
  login: string;
  contributions: number;
};

export interface RepoApiData {
  openIssues: IssuesPr[];
  openPullRequests: IssuesPr[];
  releases: Releases[];
  contributors: Contributors[];
}

export type RepoData = {
  info: string;
  repoBasicData: RepoBasicData;
  repoApiData: RepoApiData;
};

export type RepoFolderData = {
  info: string;
  folderName: string;
  path: string;
  readmeText: string | null;
  fileTree: FileTree;
};

export type RepoFileData = {
  info: string;
  fileName: string;
  path: string;
  content: string | null;
};

export type UrlType =
  | "NONE"
  | "PROFILE"
  | "REPO"
  | "REPO_IN_Folder"
  | "REPO_IN_File";
export type TabType = "main" | "login" | "signup" | "settings";

export interface TabContextType {
  tab: TabType;
  setTab: (tab: TabType) => void;
}

type User = {
  email: string;
  name: string;
  id: string;
};

export type ServerAuthData = {
  msg: string;
  user: User;
  token: string;
};

export const Storage = {
  USERINFO: "userInfo",
  AUTH: "authToken",
} as const;

export const ApiEndPoint = {
  LOGIN: "api/auth/login",
  SIGNUP: "api/auth/signup",
  PROFILE: "api/data/rag/profile",
  REPO: "api/data/rag/repo",
  REPO_FILE: "api/data/rag/repo_file",
  REPO_FOLDER: "api/data/rag/repo_folder",
  CHECK_DATA: "api/data/check",
} as const;

export const ChromeTypes = {
  INIT: "INIT_SCRAPE",
  PROFILE: "START_SCRAPE_PROFILE",
  REPO: "START_SCRAPE_REPO",
  REPO_FOLDER: "START_SCRAPE_REPO_Folder",
  REPO_FILE: "START_SCRAPE_REPO_File",
  GT_PROF_DATA: "GITHUB_PROFILE_DATA",
  GT_REPO_DATA: "GITHUB_REPO_DATA",
  GT_REPO_FILE_DATA: "GITHUB_REPO_FILE_DATA",
  GT_REPO_FOLDER_DATA: "GITHUB_REPO_FOLDER_DATA",
} as const;
