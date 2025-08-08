import { getGitHubPageType, scrapeGitHubProfile } from "./background.core";

chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  if (message.type === "INIT_SCRAPE") {
    const { url, tabId } = message;

    const pageType = getGitHubPageType(url);

    switch (pageType) {
      case "PROFILE":
        chrome.tabs.sendMessage(tabId, { type: "START_SCRAPE_PROFILE" });
        break;
      case "REPO":
        chrome.tabs.sendMessage(tabId, { type: "START_SCRAPE_REPO" });
        break;
      case "REPO_IN_Folder":
        chrome.tabs.sendMessage(tabId, { type: "START_SCRAPE_REPO_Folder" });
        break;
      case "REPO_IN_File":
        chrome.tabs.sendMessage(tabId, { type: "START_SCRAPE_REPO_File" });
        break;
      default:
        break;
    }
  }

  if (message.type === "GITHUB_PROFILE_DATA") {
    const enriched = await scrapeGitHubProfile(message.payload);

    sendResponse({ enriched });

    return true;
  }
});
