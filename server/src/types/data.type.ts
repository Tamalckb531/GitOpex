//! ----- Profile data -----
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

//! ----- Profile data -----

//! ----- Repo data -----

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

//! ----- Repo data -----

//! ----- Repo Folder data -----

export type RepoFolderData = {
  info: string;
  folderName: string;
  path: string;
  readmeText: string | null;
  fileTree: FileTree;
};

//! ----- Repo Folder data -----

//! ----- Repo File data -----

export type RepoFileData = {
  info: string;
  fileName: string;
  path: string;
  content: string | null;
};

//! ----- Repo File data -----

export type VectorMetadata = {
  info: string;
  date: string;
  text: string;
};

export type VectorData = {
  id: string;
  values: number[];
  metadata: VectorMetadata;
};

export type Query = {
  info: string;
  question: string;
};

export type UrlType =
  | "NONE"
  | "PROFILE"
  | "REPO"
  | "REPO_IN_Folder"
  | "REPO_IN_File";

export enum Constants {
  GITOPEX_INDEX = "gitopex-index",
}
