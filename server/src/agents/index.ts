import { END, START, StateGraph } from "@langchain/langgraph";
import { retrieve } from "./retrieval.node";
import { webSearch } from "./websearch.node";
import { generate } from "./generation.node";
import { GraphState } from "./state";

export const workflow = new StateGraph(GraphState)
  .addNode("retrieve", retrieve)
  .addNode("webSearch", webSearch)
  .addNode("generate", generate)
  .addEdge(START, "retrieve")
  .addConditionalEdges(
    "retrieve",
    (state: typeof GraphState.State) =>
      state.documents.length === 0 ? "webSearch" : "generate",
    {
      webSearch: "webSearch",
      generate: "generate",
    }
  )
  .addEdge("webSearch", "generate")
  .addEdge("generate", END);

export const app = workflow.compile();
