export async function absoluteFetch<
  TBody extends unknown | void = void,
  TResponseJson extends any = any,
>(
  url: string,
  config: Omit<NonNullable<RequestInit>, "body"> & {
    body?: TBody;
    searchParams?: Record<string, unknown>;
  } = {}
) {
  if (!config.headers) {
    config.headers = new Headers();
  }

  const headerList: [string, string][] = [["Accept", "application/json"]];

  if (config.body) {
    headerList.push(["Content-Type", "application/json; charset=UTF-8"]);
  }

  if (typeof window !== "undefined") {
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken) {
      headerList.push(["Authorization", `Bearer ${accessToken}`]);
    }
  }

  appendHeaderList(config.headers, headerList);

  const absoluteUrl = url.startsWith("/")
    ? `${import.meta.env.VITE_API_URL}${url}`
    : url;

  return (await fetch(absoluteUrl, {
    credentials: "include",

    ...config,

    body: config?.body ? JSON.stringify(config.body) : undefined,
  })) as unknown as Promise<
    Omit<Response, "json"> & { json: () => Promise<TResponseJson> }
  >;
}

function appendHeaderList(
  headersObj: HeadersInit | Record<string, string>,
  headerList: [string, string][]
) {
  headerList.forEach(([key, value]) => {
    if (headersObj instanceof Headers) {
      headersObj.append(key, value);
    } else if (headersObj instanceof Array) {
      headersObj.push([key, value]);
    } else {
      headersObj[key] = value;
    }
  });
}
