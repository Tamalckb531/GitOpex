import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { AI_API_KEY } from "../config/config";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: AI_API_KEY,
  model: "models/embedding-001",
});

//? One in memory variable that stores all data for users
export const vectorStore = new MemoryVectorStore(embeddings);

export const storeEmbeddings = async (docs: string[]) => {
  const documents = docs.map(
    (text: any) => new Document({ pageContent: text })
  );

  await vectorStore.addDocuments(documents);
};

//? Hello
