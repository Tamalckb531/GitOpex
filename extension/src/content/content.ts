import { getProfileData } from "./content.core";
console.log("content.js triggered");

//? Guard for content.ts
if (!window.location.hostname.includes("github.com")) {
  console.log("Not a GitHub page. Exiting  content script.");
  throw new Error("Not GitHub");
}

chrome.runtime.onMessage.addListener((message) => {
  console.log("content listener is working");

  if (message.type === "START_SCRAPE_PROFILE") {
    console.log("Scrape logic run content");

    const data = getProfileData();
    //? Sending profile data to background.ts
    chrome.runtime.sendMessage({
      type: "GITHUB_PROFILE_DATA",
      payload: data,
    });
  }
});
