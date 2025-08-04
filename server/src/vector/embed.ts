import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Constants, VectorData } from "../types/data.type";
import { createPineconeClient } from "./client";
import { HTTPException } from "hono/http-exception";

export const storeEmbeddings = async (
  docs: string[],
  apiKey: string,
  info: string,
  pineconeKey: string
) => {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: apiKey,
      model: "models/embedding-001",
    });

    //? Generate vector embeddings from input docs
    const vectors = await embeddings.embedDocuments(docs);

    //? Format each vector with metadata nd unique ID
    const now = new Date().toISOString();
    const upsertData: VectorData[] = vectors.map((values, i) => ({
      id: `doc-${i}-${Date.now()}`,
      values,
      metadata: {
        info: info,
        date: now,
        text: docs[i],
      },
    }));

    //? Init Pinecone
    const indexName = Constants.GITOPEX_INDEX;
    const { index } = createPineconeClient(pineconeKey, indexName);

    //? Upsert vector data into pinecone database
    await index.upsert(upsertData);
  } catch (error: any) {
    throw new HTTPException(500, {
      message:
        error.message ||
        "Error occurred while embeddings or storing data in vector database",
    });
  }
};
