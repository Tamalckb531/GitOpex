import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Pinecone } from "@pinecone-database/pinecone";

export let vectorStore: any;

export const storeEmbeddings = async (docs: string[], apiKey: string) => {
  const pc = new Pinecone({
    apiKey: apiKey,
  });
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: apiKey,
    model: "models/embedding-001",
  });

  //? One in memory variable that stores all data for users
  vectorStore = new MemoryVectorStore(embeddings);

  const documents = docs.map(
    (text: any) => new Document({ pageContent: text })
  );

  await vectorStore.addDocuments(documents);
};
