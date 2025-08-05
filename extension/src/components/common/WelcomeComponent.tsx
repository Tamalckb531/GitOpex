const WelcomeComponent = ({ tab }: { tab: string }) => {
  return (
    <div className=" flex flex-col justify-center items-center gap-1 p-2 mt-2 text-[var(--dark-color)]">
      <p className=" text-sm font-bold">We are now at {tab} section</p>
    </div>
  );
};

export default WelcomeComponent;
