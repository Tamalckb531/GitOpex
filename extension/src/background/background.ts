import { ChromeTypes } from "../types/data.type";
import { getGitHubPageType, scrapeGitHubProfile } from "./background.core";

chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  if (message.type === ChromeTypes.INIT) {
    const { url, tabId } = message;

    const pageType = getGitHubPageType(url);

    switch (pageType) {
      case "PROFILE":
        chrome.tabs.sendMessage(tabId, { type: ChromeTypes.PROFILE });
        break;
      case "REPO":
        chrome.tabs.sendMessage(tabId, { type: ChromeTypes.REPO });
        break;
      case "REPO_IN_Folder":
        chrome.tabs.sendMessage(tabId, { type: ChromeTypes.REPO_FOLDER });
        break;
      case "REPO_IN_File":
        chrome.tabs.sendMessage(tabId, { type: ChromeTypes.REPO_FILE });
        break;
      default:
        break;
    }
  }

  if (message.type === ChromeTypes.GT_PROF_DATA) {
    const enriched = await scrapeGitHubProfile(message.payload);

    sendResponse({ enriched });

    return true;
  }
});
