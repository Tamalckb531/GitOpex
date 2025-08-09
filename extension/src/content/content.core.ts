import type { ProfileDataPayload } from "../types/data.type";

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

export const getRepoDataFromDOM = () => {};
