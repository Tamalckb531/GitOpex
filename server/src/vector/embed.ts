import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
dotenv.config();

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.AI_API_KEY,
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
