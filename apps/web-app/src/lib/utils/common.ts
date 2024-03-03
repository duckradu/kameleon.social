import { customAlphabet } from "nanoid";

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

export const NANO_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
export const NANO_LENGTH = 12;

export const nanoid = customAlphabet(NANO_ALPHABET, NANO_LENGTH);

// https://github.com/scopsy/await-to-js/blob/master/src/await-to-js.ts
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}
