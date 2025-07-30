export interface RepoInfo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  open_issues_count: number;
  license: { name: string } | null;
  forks: number;
  open_issues: number;
  topics: string[];
  updated_at: string;
  has_issues: boolean;
  html_url: string;
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
  activeRepos: RepoInfo[];
  popularOSRepos: RepoInfo[];
};

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

export type UrlType = "NONE" | "PROFILE" | "REPO" | "REPO_IN";

export enum Constants {
  GITOPEX_INDEX = "gitopex-index",
}
