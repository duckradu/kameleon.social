import { TypeGuard } from "@sinclair/typebox";
import { schema2typebox } from "schema2typebox/dist/src/schema-to-typebox";

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

  const renamedSchema = {
    ...schema,
    title: IName,
  };

  const compiled = await schema2typebox(JSON.stringify(renamedSchema, null, 2));
  const withoutBanner = compiled.replace(/\/\*\*([\s\S]*?)\*\//, "");

  return { IName, compiled: withoutBanner };
}

export function generateResponseMap(
  IName: string,
  compiledResponseMap: { statusCode: string; IName: string }[]
) {
  return `\nexport interface ${IName} {\n${compiledResponseMap
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

  // TODO: Add support for response schemas
  let attachedSchemas = interfaces?.IBodyName // || interfaces?.IResponseMapName
    ? ", { $s: {"
    : undefined;

  if (attachedSchemas) {
    if (interfaces?.IBodyName) {
      attachedSchemas += `body: ${interfaces.IBodyName}`;
    }

    // if (interfaces?.IResponseMapName) {
    //   if (interfaces?.IBodyName) {
    //     attachedSchemas += ", ";
    //   }

    //   attachedSchemas += `response: ${interfaces.IResponseMapName}`;
    // }

    attachedSchemas += " } }";
  }

  return `Object.assign(callback${genericsStr}("${url}", "${method}")${
    attachedSchemas || ""
  })`;
}

export function precompileTemplate(
  template: string,
  templateImports: string,
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
    )
    .replaceAll(
      /import {([\s\S]*?)} from \"@sinclair\/typebox(\/value)?\"\;?/g,
      ""
    )
    .replace("$IMPORTS;", templateImports);
}
