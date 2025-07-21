import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";

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
  const upsertData = vectors.map((values, i) => ({
    id: `doc-${i}-${Date.now()}`,
    values,
    metadata: {
      info,
      date: now,
      text: docs[i],
    },
  }));

  //? Init Pinecone
  const pinecone = new Pinecone({ apiKey: pineconeKey });
  const indexName = "gitopex-index";
  const index = pinecone.Index(indexName);

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
  }

  //? Upsert vector data into pinecone database
  await index.upsert(upsertData);
};
