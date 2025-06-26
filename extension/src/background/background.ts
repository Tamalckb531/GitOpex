import { getGitHubPageType } from "../helpers/func";
import { isGithubUrl, scrapeGitHubProfile } from "./background.core";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;

  const url = tab.url || "";
  if (!isGithubUrl(url)) return;

  const pageType = getGitHubPageType(url);

  if (pageType == "PROFILE") {
    chrome.tabs.sendMessage(tabId, { type: "START_SCRAPE_PROFILE" });
  }

  if (pageType == "REPO" || pageType == "REPO_IN") {
    chrome.tabs.sendMessage(tabId, { type: "START_SCRAPE_REPO" });
  }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const url = sender.tab?.url || "";
  if (!isGithubUrl(url)) return;

  if (message.type === "GITHUB_PROFILE_DATA") {
    const enriched = await scrapeGitHubProfile(message.payload);

    sendResponse({ enriched });

    return true;
  }
});
