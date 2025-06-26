import { isGithubUrl, scrapeGitHubProfile } from "./background.core";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const url = sender.tab?.url || "";
  if (!isGithubUrl(url)) return;

  if (message.type === "GITHUB_PROFILE_DATA") {
    const enriched = await scrapeGitHubProfile(message.payload);

    sendResponse({ enriched });

    return true;
  }
});
