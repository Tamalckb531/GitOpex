import { RunnableConfig } from "@langchain/core/runnables";
import { GraphState } from "./state";

export const retrieve = async (
  state: typeof GraphState.State,
  _config?: RunnableConfig
): Promise<Partial<typeof GraphState.State>> => {
  console.log("🔍 Retrieving from vector store...");

  // TODO: Insert your retrieval logic here using state.question
  // and return matching documents from vector DB

  return {
    documents: [], // dummy for now
  };
};
