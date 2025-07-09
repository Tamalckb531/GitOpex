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
    temperature: 0.3,
    maxOutputTokens: 150,
  });

  //? Generate a well written prompt for RAG work
  // const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You're a helpful GitHub chrome extension assistant. You got data of whatever url(github) the user currently in that stored inside the vector database. If user in a github profile then you get the profile info's with lots of repo info's and if user in a repository than you got a single repository info. Reply in short, clear sentences. Be concise and give direct answers only. Assume the user is viewing a GitHub profile or repository.",
    ],
    ["human", "Here is some GitHub data:\n\n{context}\n\nQuestion: {question}"],
  ]);
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
