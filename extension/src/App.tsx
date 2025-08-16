import { useContext } from "react";
import ChatBoxWrapper from "./components/Wrapper/ChatBoxWrapper";
import { TabContext } from "./context/TabContext";
import LoginWrapper from "./components/Wrapper/LoginWrapper";
import SignupWrapper from "./components/Wrapper/SignupWrapper";
import SettingsWrapper from "./components/Wrapper/SettingsWrapper";
import { Storage } from "./types/data.type";

function App() {
  const context = useContext(TabContext);
  if (!context) return null;

  const { tab, setTab } = context;

  const token = localStorage.getItem(Storage.AUTH);

  if (token) setTab("main");

  return (
    <div className=" w-[400px] h-[600px]  bg-[var(--bg-color)] flex flex-col justify-between">
      {tab === "main" && <ChatBoxWrapper />}
      {tab === "login" && <LoginWrapper />}
      {tab === "signup" && <SignupWrapper />}
      {tab === "settings" && <SettingsWrapper />}
    </div>
  );
}

export default App;
