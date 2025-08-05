// import { useEffect } from "react";
import { useState } from "react";
import ChatBoxWrapper from "./components/Wrapper/ChatBoxWrapper";
// import { isGithubUrl } from "./helpers/func";

function App() {
  // useEffect(() => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     const url = tabs[0].url || "";
  //     if (!isGithubUrl(url)) return;

  //     chrome.runtime.sendMessage({
  //       type: "INIT_SCRAPE",
  //       url,
  //       tabId: tabs[0].id,
  //     });
  //   });
  // }, []);

  const [tab, setTab] = useState("main");
  return (
    <div className=" w-[400px] h-[600px]  bg-[var(--bg-color)] flex flex-col justify-between">
      {tab === "main" && <ChatBoxWrapper />}
    </div>
  );
}

export default App;
