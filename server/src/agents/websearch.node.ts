import { RunnableConfig } from "@langchain/core/runnables";
import { GraphState } from "./state";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";

export const webSearch = async (
  state: typeof GraphState.State,
  config?: RunnableConfig
): Promise<Partial<typeof GraphState.State>> => {
  console.log("Fallback to web search...");

  const retriever = new TavilySearchAPIRetriever({
    apiKey: state.tvKey,
    k: 1,
  });

  const webDocuments = await retriever
    .withConfig({ runName: "FetchRelevantDocumentsWeb" })
    .invoke(state.question, config);

  return {
    documents: webDocuments,
  };
};
