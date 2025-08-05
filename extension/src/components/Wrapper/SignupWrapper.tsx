import WelcomeComponent from "../common/WelcomeComponent";
import Header from "../Header";
import SignupBox from "../SignupBox/SignupBox";

const SignupWrapper = () => {
  return (
    <>
      <div className="flex flex-col flex-grow overflow-hidden">
        <Header />
        <WelcomeComponent tab="Signup" />
        <SignupBox />
      </div>
    </>
  );
};

export default SignupWrapper;
