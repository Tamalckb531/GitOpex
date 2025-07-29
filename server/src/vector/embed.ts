import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Constants, VectorData } from "../types/data.type";
import { createPineconeClient } from "./client";

//TODO: have to implement pinecone here
export const storeEmbeddings = async (
  docs: string[],
  apiKey: string,
  pineconeKey: string,
  info: string
) => {
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
      info,
      date: now,
      text: docs[i],
    },
  }));

  //? Init Pinecone
  const indexName = Constants.GITOPEX_INDEX;
  const { pinecone, index } = createPineconeClient(pineconeKey, indexName);

  //? Create index if it doesn't exist
  const indexList = await pinecone.listIndexes();
  const indexNames = indexList.indexes?.map((i) => i.name);

  if (indexNames && !indexNames.includes(indexName)) {
    await pinecone.createIndex({
      name: indexName,
      dimension: vectors[0].length,
      metric: "cosine",
      spec: {
        serverless: {
          region: "us-east-1",
          cloud: "aws",
        },
      },
    });

    //? Waiting for the readiness
    let isReady = false;
    while (!isReady) {
      const updatedList = await pinecone.listIndexes();
      isReady = updatedList.indexes?.some((i) => i.name === indexName) || false;
      if (!isReady) await new Promise((res) => setTimeout(res, 3000));
    }
  }

  //? Upsert vector data into pinecone database
  await index.upsert(upsertData);
};
