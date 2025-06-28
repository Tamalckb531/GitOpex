import { getProfileData } from "./content.core";

//? Guard for content.ts
if (!window.location.hostname.includes("github.com")) {
  throw new Error("Not GitHub");
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "START_SCRAPE_PROFILE") {
    const data = getProfileData();
    //? Sending profile data to background.ts
    chrome.runtime.sendMessage({
      type: "GITHUB_PROFILE_DATA",
      payload: data,
    });
  }
});
