import { ChromeTypes } from "../types/data.type";
import { getProfileData, getRepoDataFromDOM } from "./content.core";

//? Guard for content.ts
if (!window.location.hostname.includes("github.com")) {
  throw new Error("Not GitHub");
}

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case ChromeTypes.PROFILE:
      const data = getProfileData();
      //? Sending profile data to background.ts
      chrome.runtime.sendMessage({
        type: ChromeTypes.GT_PROF_DATA,
        payload: data,
      });
      break;
    case ChromeTypes.REPO:
      const repoBasicData = getRepoDataFromDOM();
      chrome.runtime.sendMessage({
        type: ChromeTypes.GT_REPO_DATA,
        url: message.url,
        payload: repoBasicData,
      });
      break;
    case ChromeTypes.REPO_FOLDER:
      break;
    case ChromeTypes.REPO_FILE:
      break;
    default:
      console.warn("Unknown message type:", message.type);
  }
});
