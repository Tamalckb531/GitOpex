import { Pinecone } from "@pinecone-database/pinecone";

export const createPineconeClient = (apiKey: string, indexName: string) => {
  const pinecone = new Pinecone({ apiKey });
  const index = pinecone.Index(indexName);
  return { pinecone, index };
};
