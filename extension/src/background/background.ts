console.log("Background script loaded");

let currentPageInfo: any = null;

//? Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message: ", message);
  if (message.type === "PAGE_INFO") {
    currentPageInfo = {
      ...message.data,
      tabId: sender.tab?.id,
    };

    chrome.storage.local
      .set({
        currentPageInfo: currentPageInfo,
      })
      .catch((error: any) => {
        console.error("Error storing page info: ", error);
      });

    sendResponse({ success: true });
  }

  if (message.type === "GET_CURRENT_PAGE_INFO") {
    sendResponse(currentPageInfo);
  }

  return true;
});

//? Listen For Tab Updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    console.log("Tab Updated: ", tab.url);

    currentPageInfo = {
      url: tab.url,
      title: tab.title,
      tabId: tabId,
      timestamp: Date.now(),
    };
  }

  chrome.storage.local
    .set({
      currentPageInfo: currentPageInfo,
    })
    .catch((error) => {
      console.error("Error storing tab info: ", error);
    });
});

//? Listen for tab activation (switching between tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);

    if (tab.url) {
      currentPageInfo = {
        url: tab.url,
        title: tab.title,
        tabId: activeInfo.tabId,
        timestamp: Date.now(),
      };

      chrome.storage.local.set({
        currentPageInfo: currentPageInfo,
      });
    }
  } catch (error) {
    console.error("Error getting active tab: ", error);
  }
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Extension started");
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});
