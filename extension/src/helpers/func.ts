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
    if (pathParts.length >= 3 && pathParts[2] === "tree") return "REPO_IN";

    return "NONE";
  } catch {
    return "NONE";
  }
};
