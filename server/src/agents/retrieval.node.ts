import { RunnableConfig } from "@langchain/core/runnables";
import { GraphState } from "./state";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";
import { vectorStore } from "../vector/embed";

export const retrieve = async (
  state: typeof GraphState.State,
  config?: RunnableConfig
): Promise<Partial<typeof GraphState.State>> => {
  console.log("Retrieving from vector store...");

  const retriever = ScoreThresholdRetriever.fromVectorStore(vectorStore, {
    minSimilarityScore: 0.3,
    maxK: 1,
    kIncrement: 1,
  });

  const relatedDocuments = await retriever
    .withConfig({ runName: "FetchRelevantDocuments" })
    .invoke(state.question, config);

  return {
    documents: relatedDocuments,
  };
};
