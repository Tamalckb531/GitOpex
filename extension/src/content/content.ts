console.log("Content script loaded on: ", window.location.href);

//? Function to get current page info
const getCurrentPageInfo = () => {
  return {
    url: window.location.href,
    title: document.title,
    timestamp: Date.now(),
  };
};

//? Send current page info to background script when page loads
const sendPageInfo = () => {
  const pageInfo = getCurrentPageInfo();
  window.chrome.runtime
    .sendMessage({
      type: "PAGE_INFO",
      data: pageInfo,
    })
    .catch((error) => {
      console.error("Error sending page info: ", error);
    });
};

//? Send page info immediately
sendPageInfo();

//? Listen for URL changes
let currentUrl = window.location.href;
const observer = new MutationObserver(() => {
  if (currentUrl != window.location.href) {
    currentUrl = window.location.href;
    console.log("URL changed to : ", currentUrl);
    sendPageInfo();
  }
});

//? Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

//? Listen for popstate events (back/forward navigation)
//? If DOM don't change but URL change then it gonna trigger.
window.addEventListener("popstate", () => {
  setTimeout(sendPageInfo, 100); // small delay to ensure URL is updated
});

//? Listen for pushState/replaceState (programmatic navigation)

const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = (...args) => {
  originalPushState.apply(history, args);
  setTimeout(sendPageInfo, 100);
};

history.replaceState = (...args) => {
  originalReplaceState.apply(history, args);
  setTimeout(sendPageInfo, 100);
};

//? Listen for messages from popup or background

window.chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (message.type === "GET_PAGE_INFO") {
      const pageInfo = getCurrentPageInfo();
      sendResponse(pageInfo);
    }
    return true; //? Keep message channel open for async response
  }
);
