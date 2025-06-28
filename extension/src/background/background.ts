import { getGitHubPageType, scrapeGitHubProfile } from "./background.core";

console.log("Background loaded");

chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  console.log("Background listener is working");

  console.log("Background listener didn't bounced off");

  if (message.type === "INIT_SCRAPE") {
    console.log("Scrape logic run in background");

    const { url, tabId } = message;
    console.log("This is url from the background : ", url);

    const pageType = getGitHubPageType(url);
    console.log(pageType);

    if (pageType == "PROFILE") {
      console.log("Profile getting logged");

      chrome.tabs.sendMessage(tabId, { type: "START_SCRAPE_PROFILE" });
    }

    if (pageType == "REPO" || pageType == "REPO_IN") {
      chrome.tabs.sendMessage(tabId, { type: "START_SCRAPE_REPO" });
    }
  }

  if (message.type === "GITHUB_PROFILE_DATA") {
    const enriched = await scrapeGitHubProfile(message.payload);

    sendResponse({ enriched });

    return true;
  }
});
