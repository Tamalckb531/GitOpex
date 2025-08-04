export const toPineconeFilter = (
  simpleFilter: Record<string, string>
): Record<string, object> => {
  const pineconeFilter: Record<string, object> = {};

  for (const [key, value] of Object.entries(simpleFilter)) {
    pineconeFilter[key] = { $eq: value };
  }

  return pineconeFilter;
};
