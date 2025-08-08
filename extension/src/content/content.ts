import { ChromeTypes } from "../types/data.type";
import { getProfileData } from "./content.core";

//? Guard for content.ts
if (!window.location.hostname.includes("github.com")) {
  throw new Error("Not GitHub");
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === ChromeTypes.PROFILE) {
    const data = getProfileData();
    //? Sending profile data to background.ts
    chrome.runtime.sendMessage({
      type: ChromeTypes.GT_PROF_DATA,
      payload: data,
    });
  }
});
