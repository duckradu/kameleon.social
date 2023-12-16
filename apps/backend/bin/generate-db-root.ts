import * as fs from "fs/promises";
import { glob } from "glob";
import * as path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const template = `// ! Do not modify this file unless you know what you are doing.
// ! Any changes will be overwritten by the next \`pnpm db:generate-root\`.
// ! To update the generated output look inside \`/bin/generate-db-root.ts\`

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

$IMPORTS;

import dbConfig from "~/config/db";

const pgClient = postgres(dbConfig.dbCredentials.connectionString);

export const db = drizzle(pgClient, {
  schema: {
    $SCHEMAS;
  },
});
`;

(async function main() {
  const schemaFiles = await glob(
    path.join(__dirname, "../src/modules/**/*.schema.ts")
  );
  const schemaFilesCamelCase = schemaFiles.map((schemaPath) => ({
    fileName: camelCase(path.basename(schemaPath).replace(".schema.ts", "")),
    filePath: schemaPath.replace(/.*(?=\/modules)/, "~").replace(/.ts$/, ""),
  }));

  const fileContent = template
    .replace(
      "$IMPORTS;",
      schemaFilesCamelCase
        .map(
          ({ fileName, filePath }) =>
            `import * as ${fileName}Schema from "${filePath}";`
        )
        .join("\n")
    )
    .replace(
      "    $SCHEMAS;",
      schemaFilesCamelCase
        .map(({ fileName }) => `    ${fileName}: ${fileName}Schema,`)
        .join("\n")
    );

  await fs.writeFile(path.join(__dirname, "../src/db/index.ts"), fileContent);

  console.log('Generated new "src/db/index.ts"');
})();

function camelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\-/g, "");
}
