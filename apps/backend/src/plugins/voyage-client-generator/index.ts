import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import * as fs from "fs/promises";
import get from "lodash.get";
import set from "lodash.set";
import { format } from "prettier";

import {
  compileSchema,
  generateCallback,
  generateResponseMap,
  precompileTemplate,
} from "./utils";

const template = `// ! Do not modify this file unless you know what you are doing.
// ! Any changes will be overwritten next time this is generated.
// ! To update the generated output look inside \`/src/plugins/voyage-client-generator/index.ts\`

$IMPORTS;

$INTERFACES;

export const createVoyageClient = (callback: <TPayload extends any = void, TReturnMap extends object | unknown = unknown>(url: string, method: string) => (payload: TPayload) => Promise<TReturnMap[keyof TReturnMap]>) => $DEFINITIONS;
`;

const templateImports = `import { Static, Type } from "@sinclair/typebox";`;

const InterfaceRegistry: { [key: string]: string } = {};
const ResourceRegistry = {};

// TODO: Properly type the http `method`
// TODO: Add prettier config
// TODO: Pin prettier version for repo
export default fp(async function (
  instance: FastifyInstance,
  opts?: { prefix?: string }
) {
  instance.addHook("onRoute", async ({ url, method, schema }) => {
    if (["OPTIONS", "HEAD"].includes(method as any)) {
      return void 0;
    }

    const urlWithoutPrefix = opts?.prefix
      ? url.replace(`${opts.prefix}/`, "")
      : url;

    const { body, response } = schema || {};

    let IBodyName: string | undefined;
    let IResponseMapName: string | undefined;

    const compiledBodySchema = await compileSchema(url, method as string, body);

    if (compiledBodySchema) {
      const { IName, compiled } = compiledBodySchema;

      if (!InterfaceRegistry[IName]) {
        InterfaceRegistry[IName] = compiled;
      }

      IBodyName = IName;
    }

    if (response) {
      const compiledResponseMap: { statusCode: string; IName: string }[] = [];

      for (const [statusCode, schema] of Object.entries(response)) {
        const compiledSchema = await compileSchema(
          url,
          method as string,
          schema
        );

        if (compiledSchema) {
          const { IName, compiled } = compiledSchema;

          if (!InterfaceRegistry[IName]) {
            InterfaceRegistry[IName] = compiled;
          }

          compiledResponseMap.push({ statusCode, IName });
        }
      }

      if (compiledResponseMap.length) {
        IResponseMapName = `${urlWithoutPrefix.replace("/", "_")}_${method}`;

        const responseMapInterface = generateResponseMap(
          IResponseMapName,
          compiledResponseMap
        );

        InterfaceRegistry[IResponseMapName] = responseMapInterface;
      }
    }

    const resourcePath = urlWithoutPrefix.replace("/", ".");

    set(ResourceRegistry, resourcePath, {
      ...get(ResourceRegistry, resourcePath),

      [method as string]: generateCallback(url, method as string, {
        IBodyName,
        IResponseMapName,
      }),
    });
  });

  instance.addHook("onReady", async () => {
    const compiled = await format(
      precompileTemplate(
        template,
        templateImports,
        InterfaceRegistry,
        ResourceRegistry
      ),
      { parser: "typescript" }
    );

    await fs.writeFile("./generated/voyage-client.ts", compiled);
  });
});
