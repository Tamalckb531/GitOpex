import type {
  Enriched,
  ProfileDataPayload,
  RepoInfo,
} from "../types/data.type";

export const isGithubUrl = (url: string): boolean => {
  return url.includes("github.com");
};

export const slimRepo = (repo: any): RepoInfo => {
  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    size: repo.size,
    stargazers_count: repo.stargazers_count,
    watchers_count: repo.watchers_count,
    language: repo.language,
    open_issues_count: repo.open_issues_count,
    license: repo.license ? { name: repo.license.name } : null,
    forks: repo.forks,
    open_issues: repo.open_issues,
    topics: repo.topics,
    updated_at: repo.updated_at,
    has_issues: repo.has_issues,
    html_url: repo.html_url,
  };
};

export const scrapeGitHubProfile = async (
  payload: ProfileDataPayload
): Promise<Enriched> => {
  const userData: ProfileDataPayload = payload;
  const username: string = userData.username;

  //? Fetch repos
  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&type=owner&sort=updated`
  );
  const repos = await reposRes.json();

  const allRepos: RepoInfo[] = repos.map(slimRepo);

  //? Extract enriched information
  const openSourceRepos = allRepos.filter((repo: any) => repo.license);
  const activeRepos = allRepos.filter((repo: any) => repo.open_issues_count);
  const popularRepos = [...allRepos]
    .sort(
      (a: any, b: any) =>
        b.stargazers_count +
        b.forks_count +
        b.open_issues_count -
        (a.stargazers_count + a.forks_count + a.open_issues_count)
    )
    .slice(0, 5);

  const enriched: Enriched = {
    userData,
    allRepos,
    openSourceRepos,
    activeRepos,
    popularRepos,
  };

  //? Send to backend server
  try {
    await fetch("http://localhost:8787/api/data/rag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enriched),
    });
    console.log(enriched);
  } catch (err) {
    console.error("Failed to send data to backend");
  }

  return enriched;
};
