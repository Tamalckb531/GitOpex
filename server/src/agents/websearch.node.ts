import { RunnableConfig } from "@langchain/core/runnables";
import { GraphState } from "./state";

export const webSearch = async (
  state: typeof GraphState.State,
  _config?: RunnableConfig
): Promise<Partial<typeof GraphState.State>> => {
  console.log("🌐 Fallback to web search...");

  // TODO: Do web search if no vector hits
  return {
    documents: [], // dummy
  };
};
