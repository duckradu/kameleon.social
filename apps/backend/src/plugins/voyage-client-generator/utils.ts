import { TypeGuard } from "@sinclair/typebox";
import { compile } from "json-schema-to-typescript";

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function compileSchema(
  url: string,
  method: string,
  schema?: unknown
): Promise<{ IName: string; compiled: string } | void> {
  if (!schema) {
    return;
  }

  if (!TypeGuard.TSchema(schema)) {
    return console.error(
      `Invalid schema for [${method}] ${url} - Non TypeBox schema`
    );
  }

  if (!schema.title) {
    return console.error(
      `Invalid schema for [${method}] ${url} - Missing schema title`
    );
  }

  const IName = capitalize(
    schema.title.replace(/^public/, "").replace(/Schema$/, "")
  );

  const cleanSchema = Object.keys(schema).reduce(
    (acc, key) => ({
      ...acc,
      [key]: key === "title" ? IName : schema[key],
    }),
    {}
  );

  const compiled = await compile(cleanSchema, IName, {
    bannerComment: "",
    format: false,
    additionalProperties: false,
  });

  return { IName, compiled };
}

export function generateResponseMap(
  IName: string,
  compiledResponseMap: { statusCode: string; IName: string }[]
) {
  return `export interface ${IName} {\n${compiledResponseMap
    .map(
      ({ statusCode, IName: IResponseName }) =>
        `  ${statusCode}: ${IResponseName}\n`
    )
    .join("")}}\n`;
}

export function generateCallback(
  url: string,
  method: string,
  interfaces?: { IBodyName?: string; IResponseMapName?: string }
) {
  let genericsStr = ``;

  if (interfaces?.IBodyName) {
    genericsStr = `<${interfaces.IBodyName}`;
  }

  if (interfaces?.IResponseMapName) {
    if (genericsStr.length) {
      genericsStr += `, ${interfaces.IResponseMapName}`;
    } else {
      genericsStr = `<void, ${interfaces.IResponseMapName}`;
    }
  }

  if (genericsStr.length) {
    genericsStr += `>`;
  }

  return `callback${genericsStr}("${url}", "${method}")`;
}

export function compileTemplate(
  template: string,
  InterfaceRegistry: object,
  ResourceRegistry: object
) {
  return template
    .replace("$INTERFACES;", Object.values(InterfaceRegistry).join(""))
    .replace(
      "$DEFINITIONS;",
      `(${JSON.stringify(ResourceRegistry)
        .replaceAll('"', "")
        .replaceAll("\\", '"')});`
    );
}
