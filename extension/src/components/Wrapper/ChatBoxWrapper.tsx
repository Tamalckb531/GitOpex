import AMA from "../ChatBox/AMA";
import ChatBar from "../ChatBox/ChatBar";
import ChatBox from "../ChatBox/ChatBox";
import Header from "../Header";

const ChatBoxWrapper = () => {
  return (
    <>
      <div className="flex flex-col flex-grow overflow-hidden">
        <Header />
        <AMA />
        <ChatBox />
      </div>
      <ChatBar />
    </>
  );
};

export default ChatBoxWrapper;
