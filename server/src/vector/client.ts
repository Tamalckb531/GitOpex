import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import { Pinecone } from "@pinecone-database/pinecone";
import { Constants } from "../types/data.type";
export const getVectorStore = async (apiKey: string, pineconeKey: string): Promise<any> => {
    
    const pinecone = new Pinecone({ apiKey: pineconeKey });
    const pineconeIndex = pinecone.Index(Constants.GITOPEX_INDEX)

    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: apiKey,
        model: "models/embeddings-001"
    });

    return await 
}