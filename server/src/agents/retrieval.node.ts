import { RunnableConfig } from "@langchain/core/runnables";
import { GraphState } from "./state";
import { createPineconeClient } from "../vector/client";
import { Constants } from "../types/data.type";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const retrieve = async (
  state: typeof GraphState.State,
  config?: RunnableConfig
): Promise<Partial<typeof GraphState.State>> => {
  console.log("Retrieving from vector store...");

  const pineconeKey = state.pineconeKey;
  const { index } = createPineconeClient(pineconeKey, Constants.GITOPEX_INDEX);

  const filter = {
    info: state.info,
  };

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: state.apiKey,
    model: "models/embedding-001",
  });

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });

  const retriever = {
    withConfig: (_cfg: RunnableConfig) => ({
      invoke: (query: string, config?: RunnableConfig) =>
        vectorStore.similaritySearch(query, 3, { filter }, config?.callbacks),
    }),
  };

  const relatedDocuments = await retriever
    .withConfig({ runName: "FetchRelevantDocuments" })
    .invoke(state.question, config);

  return {
    documents: relatedDocuments,
  };
};
