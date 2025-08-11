import { ChromeTypes } from "../types/data.type";
import {
  getProfileData,
  getRepoDataFromDOM,
  getRepoFileDataFromDOM,
  getRepoFolderDataFromDOM,
} from "./content.core";

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
        payload: repoBasicData,
      });
      break;
    case ChromeTypes.REPO_FOLDER:
      const repoFolderData = getRepoFolderDataFromDOM();
      chrome.runtime.sendMessage({
        type: ChromeTypes.GT_REPO_FOLDER_DATA,
        payload: repoFolderData,
      });
      break;
    case ChromeTypes.REPO_FILE:
      const repoFileData = getRepoFileDataFromDOM();
      chrome.runtime.sendMessage({
        type: ChromeTypes.GT_REPO_FILE_DATA,
        payload: repoFileData,
      });
      break;
    default:
      console.warn("Unknown message type: ", message.type);
  }
});
