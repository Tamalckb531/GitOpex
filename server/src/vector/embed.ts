import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { AI_API_KEY } from "../config/config";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: AI_API_KEY,
  model: "models/embedding-001",
});

export const storeEmbeddings = async (docs: string[]) => {
  const documents = docs.map(
    (text: any) => new Document({ pageContent: text })
  );

  const vectorStore = new MemoryVectorStore(embeddings);
  await vectorStore.addDocuments(documents);

  console.log("Embeddings stored in memory");
  return vectorStore;
};
