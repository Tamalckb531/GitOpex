import type { UrlType } from "../types/data.type";

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

export const parseCountString = (str: string | null): number => {
  if (!str) return 0;
  str = str.trim().toLowerCase();
  if (str.endsWith("k"))
    return Math.round(parseFloat(str.replace("k", "")) * 1000);

  return parseInt(str, 10) || 0;
};

export const isGithubUrl = (url: string): boolean => {
  return url.includes("github.com");
};
