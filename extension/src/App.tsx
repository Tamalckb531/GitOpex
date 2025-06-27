import { useEffect } from "react";
import AMA from "./components/AMA";
import ChatBar from "./components/ChatBar";
import ChatBox from "./components/ChatBox";
import Header from "./components/Header";

function App() {
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url || "";
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
