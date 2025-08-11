import { ChromeTypes } from "../types/data.type";
import {
  getGitHubPageType,
  scrapeGTProfile,
  scrapeGTRepo,
  sendRepoFolderData,
} from "./background.core";

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
        chrome.tabs.sendMessage(tabId, {
          type: ChromeTypes.REPO_FOLDER,
          url: url,
        });
        break;
      case "REPO_IN_File":
        chrome.tabs.sendMessage(tabId, {
          type: ChromeTypes.REPO_FILE,
          url: url,
        });
        break;
      default:
        break;
    }
  } else if (message.type === ChromeTypes.GT_PROF_DATA) {
    const enriched = await scrapeGTProfile(message.payload);

    sendResponse({ enriched });

    return true;
  } else if (message.type === ChromeTypes.GT_PROF_DATA) {
    const repoFullData = await scrapeGTRepo(message.payload);

    sendResponse({ repoFullData });

    return true;
  } else if (message.type === ChromeTypes.GT_REPO_FOLDER_DATA) {
    const res = await sendRepoFolderData(message.payload);
    res
      ? sendResponse({ msg: "Data send successfully" })
      : sendResponse({ msg: "Data couldn't sent" });
    return res;
  } else if (message.type === ChromeTypes.GT_REPO_FILE_DATA) {
    return true;
  }
});
