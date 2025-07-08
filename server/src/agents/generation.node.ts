import { RunnableConfig } from "@langchain/core/runnables";
import { GraphState } from "./state";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AI_API_KEY } from "../config/config";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";

export const generate = async (
  state: typeof GraphState.State,
  config?: RunnableConfig
): Promise<Partial<typeof GraphState.State>> => {
  console.log("Generating final output...");

  const model = new ChatGoogleGenerativeAI({
    apiKey: AI_API_KEY,
    model: "gemini-1.5-flash",
    temperature: 0,
  });

  //? Generate a well written prompt for RAG work
  const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");
  //? Feed the prompt to the model and create pipeline to parse the string output from complex ai output
  const ragChain = prompt.pipe(model).pipe(new StringOutputParser());

  const generation = await ragChain
    .withConfig({ runName: "GenerateAnswer" })
    .invoke(
      {
        context: formatDocumentsAsString(state.documents),
        question: state.question,
      },
      config
    );

  return {
    generation,
  };
};
