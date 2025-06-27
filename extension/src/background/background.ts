import { getGitHubPageType } from "../helpers/func";
import { isGithubUrl, scrapeGitHubProfile } from "./background.core";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const url = sender.tab?.url || "";
  if (!isGithubUrl(url)) return;

  if (message.type === "INIT_SCRAPE") {
    const { url, tabId } = message;
    if (!isGithubUrl(url)) return;

    const pageType = getGitHubPageType(url);

    if (pageType == "PROFILE") {
      chrome.tabs.sendMessage(tabId, { type: "START_SCRAPE_PROFILE" });
    }

    if (pageType == "REPO" || pageType == "REPO_IN") {
      chrome.tabs.sendMessage(tabId, { type: "START_SCRAPE_REPO" });
    }
  }

  if (message.type === "GITHUB_PROFILE_DATA") {
    const enriched = await scrapeGitHubProfile(message.payload);

    sendResponse({ enriched });

    return true;
  }
});
