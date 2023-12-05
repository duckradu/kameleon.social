import { customAlphabet } from "nanoid";

export const DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
export const DEFAULT_SIZE = 12;

export const nanoid = customAlphabet(DEFAULT_ALPHABET, DEFAULT_SIZE);
