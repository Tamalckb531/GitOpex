interface msg {
  type: "send" | "receive";
  message: string;
}
const ChatBox = () => {
  return (
    <div className=" flex flex-col flex-grow gap-4 mx-2 w-full overflow-y-auto scrollbar-thin">
      <ChatMsg
        type="send"
        message="Hey! Can You please explain what kind of projects this profile has ?"
      />
      <ChatMsg
        type="receive"
        message="Hi there! This profile has mostly Typescript based projects. Two of them (rankdevs, GitOpex) are actively receiving open source contributions."
      />
      <ChatMsg
        type="send"
        message="Okay! Can you tell me where should I start contributing ? I use typescript and pro-efficient at web dev"
      />
      <ChatMsg type="receive" message="Rankdevs will be perfect for you." />
      <ChatMsg
        type="send"
        message="Okay! Can you tell me where should I start contributing ? I use typescript and pro-efficient at web dev"
      />
      <ChatMsg type="receive" message="Rankdevs will be perfect for you." />
    </div>
  );
};

const ChatMsg = ({ type, message }: msg) => {
  return (
    <div
      className={` flex items-center ${
        type === "send" ? " justify-end" : " justify-start"
      } text-[15px] font-bold`}
    >
      <p
        className={` max-w-[75%] shadow-lg rounded-2xl p-2 ${
          type === "send"
            ? " bg-[var(--bg-color)] text-[var(--dark-color)]"
            : " bg-[var(--dark-color)] text-[var(--bg-color)]"
        }`}
      >
        {message}
      </p>
    </div>
  );
};

export default ChatBox;
