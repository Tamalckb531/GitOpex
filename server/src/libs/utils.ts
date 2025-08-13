export const toPineconeFilter = (
  simpleFilter: Record<string, string>
): Record<string, object> => {
  const pineconeFilter: Record<string, object> = {};

  for (const [key, value] of Object.entries(simpleFilter)) {
    pineconeFilter[key] = { $eq: value };
  }

  return pineconeFilter;
};

export const formatDatetime = (isoString: string) => {
  const date = new Date(isoString);

  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  return `${day} ${month}, ${year} at ${formattedHours}:${minutes} ${period}`;
};
