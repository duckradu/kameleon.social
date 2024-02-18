export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  if (process.env.NODE_ENV === "production") {
    return "https://example.com"; // TODO: Replace with actual domain
  }

  return `http://${process.env.HOST ?? "localhost"}:${
    process.env.PORT ?? 3000
  }`;
}
