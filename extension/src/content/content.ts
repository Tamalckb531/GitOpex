import { ChromeTypes } from "../types/data.type";
import { getProfileData } from "./content.core";

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
      break;
    case ChromeTypes.REPO_FOLDER:
      break;
    case ChromeTypes.REPO_FILE:
      break;
    default:
      console.warn("Unknown message type:", message.type);
  }
});
