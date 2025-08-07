import { useEffect, useState } from "react";

const AMA = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [xPage, setXPage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [githubType, setGithubType] = useState<string>("");
  const [githubName, setGithubName] = useState<string>("");

  useEffect(() => {
    getCurrentTab();
  }, []);

  const getTitleUrl = (tab: string): void => {
    const url = new URL(tab);
    const pathSegments = url.pathname
      .split("/")
      .filter((segment) => segment !== "");

    console.log(url);
    console.log(pathSegments);

    const reservedPages = [
      "dashboard",
      "notifications",
      "settings",
      "pulls",
      "issues",
      "marketplace",
      "explore",
      "apps",
      "topics",
      "collections",
      "events",
      "sponsors",
      "codespaces",
      "copilot",
      "discussion",
      "projects",
    ];

    if (url.host !== "github.com") {
      setXPage(true);
      return;
    }

    if (
      pathSegments.length >= 1 &&
      pathSegments[0].toLowerCase() == "github.com"
    ) {
      pathSegments.shift();
    }

    if (reservedPages.includes(pathSegments[0].toLowerCase())) {
      setGithubType("Github Page");
      setGithubName(pathSegments[0]);
    } else if (pathSegments.length == 1) {
      setGithubType("Github Profile");
      setGithubName(pathSegments[0]);
    } else if (pathSegments.length == 2) {
      setGithubType("Github Repository");
      setGithubName(pathSegments[1]);
    } else if (pathSegments.length == 4) {
      setGithubType("Github Repository");
      setGithubName(pathSegments[1]);
    } else if (pathSegments.length >= 5 && pathSegments[2] == "tree") {
      setGithubType(`${pathSegments[1]} Folder`);
      setGithubName(pathSegments[pathSegments.length - 1]);
    } else if (pathSegments.length >= 5 && pathSegments[2] == "blob") {
      setGithubType(`${pathSegments[1]} File`);
      setGithubName(pathSegments[pathSegments.length - 1]);
    } else {
      setGithubType("Github Page");
      setGithubName(pathSegments[0]);
    }
  };

  const getCurrentTab = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab && tab.url) {
        getTitleUrl(tab.url);
      } else {
        setError("Unable to get current tab information");
      }
    } catch (err) {
      console.error("Error getting current tab:", err);
      setError("Failed to retrieve tab information");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=" flex flex-col justify-center items-center gap-1 p-2 mt-2 text-[var(--dark-color)]">
        <p className=" text-sm font-bold">Getting the tab Info...</p>
      </div>
    );
  }

  if (xPage) {
    return (
      <div className=" flex flex-col justify-center items-center gap-1 p-2 mt-2 text-[var(--dark-color)]">
        <p className=" text-sm font-bold">Sorry! It only works on github</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" flex flex-col justify-center items-center gap-1 p-2 mt-2 text-[var(--dark-color)]">
        <p className=" text-sm font-bold">Some Error Occurred: </p>
        <p>{error}</p>
        <button
          onClick={getCurrentTab}
          className=" bg-red-900 text-[var(--bg-color)] p-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className=" flex flex-col justify-center items-center gap-1 p-2 mt-2 text-[var(--dark-color)]">
      {githubName && githubType && (
        <p className=" text-sm font-bold text-center">
          We are now at {githubType} : {githubName}
        </p>
      )}
      <p>Ask Me Anything</p>
    </div>
  );
};

export default AMA;
