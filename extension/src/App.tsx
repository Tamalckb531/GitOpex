import AMA from "./components/AMA";
import ChatBar from "./components/ChatBar";
import ChatBox from "./components/ChatBox";
import Header from "./components/Header";

function App() {
  return (
    <div className=" w-[400px] h-[600px]  bg-[var(--bg-color)] flex flex-col justify-between">
      <div>
        <Header />
        <AMA />
        <ChatBox />
      </div>
      <ChatBar />
    </div>
  );
}

export default App;
