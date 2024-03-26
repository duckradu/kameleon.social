import { actors } from "~/server/db/schemas";

export function getShortName(fullName: string) {
  return fullName
    .split(" ")
    .map(([s]) => s)
    .join("");
}

export function isSameActor(
  A1?: typeof actors.$inferSelect,
  A2?: typeof actors.$inferSelect
) {
  if (typeof A1 === "undefined" || typeof A2 === "undefined") {
    return false;
  }

  return A1.id === A2.id;
}
