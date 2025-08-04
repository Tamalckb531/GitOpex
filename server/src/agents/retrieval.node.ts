import { RunnableConfig } from "@langchain/core/runnables";
import { GraphState } from "./state";
import { createPineconeClient } from "../vector/client";
import { Constants } from "../types/data.type";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { HTTPException } from "hono/http-exception";

export const retrieve = async (
  state: typeof GraphState.State,
  config?: RunnableConfig
): Promise<Partial<typeof GraphState.State>> => {
  console.log("Retrieving from vector store...");
  let relatedDocuments;

  try {
    const pineconeKey = state.pineconeKey;
    const { index } = createPineconeClient(
      pineconeKey,
      Constants.GITOPEX_INDEX
    );

    //TODO: have to implement the filter system here later -> causing issues
    const filter = {
      info: { $eq: state.info },
    };

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: state.apiKey,
      model: "models/embedding-001",
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      maxConcurrency: 5,
    });

    const retriever = {
      withConfig: (_cfg: RunnableConfig) => ({
        invoke: (query: string, _config?: RunnableConfig) =>
          vectorStore.similaritySearch(query, 3),
      }),
    };

    relatedDocuments = await retriever
      .withConfig({ runName: "FetchRelevantDocuments" })
      .invoke(state.question, config);
  } catch (error: any) {
    throw new HTTPException(500, {
      message: error.message || "Error occurred while retrieving docs",
    });
  }

  return {
    documents: relatedDocuments,
  };
};
