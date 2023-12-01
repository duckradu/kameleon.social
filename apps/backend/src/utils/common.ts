import { dirname } from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);

export const __dirname = dirname(__filename);

export const __DEV__ = process.env.NODE_ENV === "development";

export const noop = () => {};
