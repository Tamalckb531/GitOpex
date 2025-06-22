chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "GITHUB_PROFILE_DATA") {
    const username = message.payload.username;

    //? Fetch public profile info
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    const userData = await userRes.json();

    //? Fetch repos
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=owner&sort=updated`
    );
    const repos = await reposRes.json();

    //? Extract enriched information
    const openSourceRepos = repos.filter((repo: any) => repo.license);
    const activeRepos = repos.filter((repo: any) => repo.open_issues_count);
    const popularRepos = [...repos]
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
        repos,
        openSourceRepos,
        activeRepos,
        popularRepos,
      },
    });

    return true;
  }
});
