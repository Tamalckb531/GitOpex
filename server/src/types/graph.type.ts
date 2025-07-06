export type AgentState = {
  query: string;
  retrievedDocs?: string[];
  hasEnoughDocs?: boolean;
  webResults?: string[];
  answer?: string[];
};
