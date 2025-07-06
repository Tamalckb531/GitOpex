import { RunnableConfig } from "@langchain/core/runnables";
import { GraphState } from "./state";

export const generate = async (
  state: typeof GraphState.State,
  _config?: RunnableConfig
): Promise<Partial<typeof GraphState.State>> => {
  console.log("🧠 Generating final output...");

  // TODO: Use LLM to generate response using state.documents + state.question
  return {
    generation: "This is the final answer.",
  };
};
