import { Annotation } from "@langchain/langgraph";
import { DocumentInterface } from "@langchain/core/documents";

export const GraphState = Annotation.Root({
  documents: Annotation<DocumentInterface[]>({
    reducer: (x, y) => (y ? y.concat(x ?? []) : []),
  }),
  question: Annotation<string>({
    reducer: (x, y) => y ?? x ?? "",
  }),
  generation: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
});
