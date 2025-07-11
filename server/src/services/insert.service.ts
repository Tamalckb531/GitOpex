import { app } from "../agents";
import { Enriched } from "../types/data.type";
import { storeEmbeddings } from "../vector/embed";

const stringifyEnriched = (enriched: Enriched): string[] => {
  const { userData, allRepos, activeRepos, popularOSRepos } = enriched;

  const profileText = `Name: ${userData.name}, Username: ${userData.username}, Bio: ${userData.bio}, Location: ${userData.location}, Website: ${userData.website}`;

  const repoTexts = allRepos.map((repo) => {
    return `Repository: ${repo.name}, Description: ${
      repo.description
    }, Language: ${repo.language}, Stars: ${
      repo.stargazers_count
    }, Topics: ${repo.topics?.join(", ")}`;
  });

  const activeRepoTexts = activeRepos.map((repo) => {
    return `Active Repository: ${repo.name}, Description: ${
      repo.description
    }, Language: ${repo.language}, Stars: ${
      repo.stargazers_count
    }, Topics: ${repo.topics?.join(", ")}`;
  });

  const popularOsTexts = popularOSRepos.map((repo) => {
    return `Popular Open Source Repo: ${repo.name}, Description: ${
      repo.description
    }, Language: ${repo.language}, Stars: ${
      repo.stargazers_count
    }, Topics: ${repo.topics?.join(", ")}`;
  });

  return [profileText, ...repoTexts, ...activeRepoTexts, ...popularOsTexts];
};

export const handleEnrichedData = async (enriched: Enriched) => {
  const docs = stringifyEnriched(enriched);
  await storeEmbeddings(docs);
};

export const handleInvoking = async (query: string): Promise<string> => {
  const output = await app.invoke({ question: query });
  return output.generation;
};
