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
} as const;

export const ChromeTypes = {
  INIT: "INIT_SCRAPE",
  PROFILE: "START_SCRAPE_PROFILE",
  REPO: "START_SCRAPE_REPO",
  REPO_FOLDER: "START_SCRAPE_REPO_Folder",
  REPO_FILE: "START_SCRAPE_REPO_File",
  GT_PROF_DATA: "GITHUB_PROFILE_DATA",
} as const;
