import { RunnableConfig } from "@langchain/core/runnables";
import { GraphState } from "./state";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { HTTPException } from "hono/http-exception";

export const webSearch = async (
  state: typeof GraphState.State,
  config?: RunnableConfig
): Promise<Partial<typeof GraphState.State>> => {
  console.log("Fallback to web search...");

  let webDocuments;
  try {
    const retriever = new TavilySearchAPIRetriever({
      apiKey: state.tvKey,
      k: 1,
    });

    webDocuments = await retriever
      .withConfig({ runName: "FetchRelevantDocumentsWeb" })
      .invoke(state.question, config);
  } catch (error: any) {
    throw new HTTPException(500, {
      message: error.message || "Error occurred while retrieving web docs",
    });
  }
  return {
    documents: webDocuments,
  };
};
