import { useEffect, useState } from "react";

const AMA = () => {
  const [githubType, setGithubType] = useState<string>("");
  const [githubName, setGithubName] = useState<string>("");

  useEffect(() => {
    const currentUrl = window.parent.location.href;
    console.log("Current Url : ", currentUrl);
    const url = new URL(currentUrl);
    console.log("new Url : ", url);
    const pathSegments = url.pathname
      .split("/")
      .filter((segment) => segment !== "");
    console.log("Path Segments : ", pathSegments);

    if (
      pathSegments.length >= 1 &&
      pathSegments[0].toLowerCase() == "github.com"
    ) {
      pathSegments.shift();
    }

    console.log(pathSegments);

    if (pathSegments.length == 1) {
      setGithubType("Profile");
      setGithubName(pathSegments[0]);
    } else if (pathSegments.length == 2) {
      setGithubType("Repository");
      setGithubName(pathSegments[1]);
    } else {
      setGithubType("GitHub Page");
      setGithubName("Unknown");
    }
  }, []);

  return (
    <div className=" flex flex-col justify-center items-center gap-1 p-2 mt-2 text-[var(--dark-color)]">
      <p className=" text-sm font-bold">
        We are now at Github {githubType} : {githubName}
      </p>
      <p>Ask Me Anything</p>
    </div>
  );
};

export default AMA;
