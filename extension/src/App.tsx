import { useEffect } from "react";
import AMA from "./components/AMA";
import ChatBar from "./components/ChatBar";
import ChatBox from "./components/ChatBox";
import Header from "./components/Header";
import { isGithubUrl } from "./helpers/func";

function App() {
  console.log("App rendered");

  useEffect(() => {
    console.log("Popup mounted");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url || "";
      if (!isGithubUrl(url)) return;

      console.log("Scraping gonna run afterward");

      chrome.runtime.sendMessage({
        type: "INIT_SCRAPE",
        url,
        tabId: tabs[0].id,
      });
    });
  }, []);
  return (
    <div className=" w-[400px] h-[600px]  bg-[var(--bg-color)] flex flex-col justify-between">
      <div className="flex flex-col flex-grow overflow-hidden">
        <Header />
        <AMA />
        <ChatBox />
      </div>
      <ChatBar />
    </div>
  );
}

export default App;
