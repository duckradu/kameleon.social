export async function xfetch(url: string, config: Parameters<typeof fetch>[1]) {
  const absoluteUrl = /^https?:\/\//i.test(url)
    ? url
    : `${import.meta.env.VITE_API_URL}${url}`;

  return await fetch(absoluteUrl, {
    ...config,
    headers: {
      Accept: "application/json",
      "Content-type": "application/json; charset=UTF-8",
      ...config?.headers,
    },
    body: config?.body ? JSON.stringify(config.body) : undefined,
  });
}
