export function getShortName(fullName: string) {
  return fullName
    .split(" ")
    .map(([s]) => s)
    .join("");
}
