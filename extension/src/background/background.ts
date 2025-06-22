interface RepoInfo {
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

interface ProfileDataPayload {
  username: string;
  name: string;
  bio: string;
  location: string;
  website: string;
  repoCount: string;
  pinnedRepos: string[];
}

const slimRepo = (repo: any): RepoInfo => {
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

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const url = sender.tab?.url || "";
  if (!url.includes("github.com")) {
    console.log("Message not from GitHub. Ignored.");
    return;
  }

  if (message.type === "GITHUB_PROFILE_DATA") {
    const userData: ProfileDataPayload = message.payload;
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

    sendResponse({
      enriched: {
        userData,
        allRepos,
        openSourceRepos,
        activeRepos,
        popularRepos,
      },
    });

    return true;
  }
});
