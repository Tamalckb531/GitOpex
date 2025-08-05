import Header from "../Header";
import LoginForm from "../LoginBox/LoginForm";

const ChatBoxWrapper = () => {
  return (
    <>
      <div className="flex flex-col flex-grow overflow-hidden">
        <Header />
        <LoginForm />
      </div>
    </>
  );
};

export default ChatBoxWrapper;
