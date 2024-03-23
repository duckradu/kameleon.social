// https://github.com/Shyp/go-dberror

import capitalize from "lodash.capitalize";
import { PostgresError } from "postgres";

export enum PG_ERROR_CODE {
  CodeNumbericValueOutOfRange = "22003",
  CodeInvalidTextRepresentation = "22P02",
  CodeNotNullViolation = "23502",
  CodeForeignKeyViolation = "23503",
  CodeUniqueViolation = "23505",
  CodeCheckViolation = "23514",
  CodeLockNotAvailable = "55P03",
}

export type FriendlyPostgresErrorConstructor = {
  message: string;

  severity: string;
  code: PG_ERROR_CODE;
  routine?: string;

  tableName?: string;
  columnName?: string;
  constraintName?: string;
};

export class FriendlyPostgresError extends Error {
  message: FriendlyPostgresErrorConstructor["message"];

  severity: FriendlyPostgresErrorConstructor["severity"];
  code: FriendlyPostgresErrorConstructor["code"];
  routine: FriendlyPostgresErrorConstructor["routine"];

  tableName: FriendlyPostgresErrorConstructor["tableName"];
  columnName: FriendlyPostgresErrorConstructor["columnName"];
  constraintName: FriendlyPostgresErrorConstructor["constraintName"];

  constructor({
    message,

    severity,
    code,
    routine,

    tableName,
    columnName,
    constraintName,
  }: FriendlyPostgresErrorConstructor) {
    super(message);

    this.message = message;

    this.severity = severity;
    this.code = code;
    this.routine = routine;

    this.tableName = tableName;
    this.columnName = columnName;
    this.constraintName = constraintName;
  }
}

export type Constraint = {
  name: string;

  getError: (err: PostgresError) => FriendlyPostgresError;
};

const constraintMap = new Map<string, Constraint>();

export function RegisterConstraint(c: Constraint) {
  if (constraintMap.get(c.name)) {
    throw new Error(`RegisterConstraint called twice for name ${c.name}`);
  }

  constraintMap.set(c.name, c);
}

const columnRegexp = /Key \((.+)\)=/;
const valueRegexp = /Key \(.+\)=\((.+)\)/;
const foreignKeyTableRegexp = /not present in table "(.+)"/;
const parentTableRegexp = /update or delete on table "([^"]+)"/;

export function getError(
  err?: PostgresError,
  getMessage?: (
    err: FriendlyPostgresErrorConstructor
  ) => PostgresError["message"]
) {
  if (!err) {
    return null;
  }

  const friendlyErrorConstructorValues: FriendlyPostgresErrorConstructor = {
    message: err.message,
    severity: err.severity,
    code: err.code as PG_ERROR_CODE,
  };

  switch (err.code) {
    case PG_ERROR_CODE.CodeNumbericValueOutOfRange: {
      friendlyErrorConstructorValues.message = capitalize(
        err.message.replace("out of range", "too large or too small")
      );

      return new FriendlyPostgresError({
        ...friendlyErrorConstructorValues,
        message:
          getMessage?.(friendlyErrorConstructorValues) ||
          friendlyErrorConstructorValues.message,
      });
    }
    case PG_ERROR_CODE.CodeInvalidTextRepresentation: {
      if (err.message.includes("invalid input syntax for type")) {
        friendlyErrorConstructorValues.message = err.message.replace(
          "input syntax for",
          "input syntax for type"
        );
      }

      friendlyErrorConstructorValues.message =
        friendlyErrorConstructorValues.message.replace(
          "input value for enum",
          ""
        );
      friendlyErrorConstructorValues.message = capitalize(
        friendlyErrorConstructorValues.message
      );

      return new FriendlyPostgresError({
        ...friendlyErrorConstructorValues,
        message:
          getMessage?.(friendlyErrorConstructorValues) ||
          friendlyErrorConstructorValues.message,
      });
    }
    case PG_ERROR_CODE.CodeNotNullViolation: {
      friendlyErrorConstructorValues.message = `No ${err.column_name} was provided. Please provide a ${err.column_name}`;

      friendlyErrorConstructorValues.columnName = err.column_name;
      friendlyErrorConstructorValues.tableName = err.table_name;

      return new FriendlyPostgresError({
        ...friendlyErrorConstructorValues,
        message:
          getMessage?.(friendlyErrorConstructorValues) ||
          friendlyErrorConstructorValues.message,
      });
    }
    case PG_ERROR_CODE.CodeForeignKeyViolation: {
      friendlyErrorConstructorValues.columnName = matchPGErrorPart(
        columnRegexp,
        err.detail
      );

      if (friendlyErrorConstructorValues.columnName === "") {
        friendlyErrorConstructorValues.columnName = "value";
      }

      const foreignKeyTable = matchPGErrorPart(
        foreignKeyTableRegexp,
        err.detail
      );

      const tablePart =
        foreignKeyTable === ""
          ? "in the parent table"
          : `in the ${foreignKeyTable} table`;

      const valueName = matchPGErrorPart(valueRegexp, err.detail);

      switch (true) {
        case err.message.includes("update or delete"): {
          const parentTable = matchPGErrorPart(parentTableRegexp, err.message);

          friendlyErrorConstructorValues.message = `Can't update or delete ${parentTable} records because the ${parentTable} ${friendlyErrorConstructorValues.columnName} (${valueName}) is still referenced by the ${err.table_name} table`;
        }
        case valueName === "": {
          friendlyErrorConstructorValues.message = `Can't save to ${err.table_name} because the ${friendlyErrorConstructorValues.columnName} isn't present ${tablePart}`;
        }
        default: {
          friendlyErrorConstructorValues.message = `Can't save to ${err.table_name} because the ${friendlyErrorConstructorValues.columnName} (${valueName}) isn't present ${tablePart}`;
        }
      }

      friendlyErrorConstructorValues.routine = err.routine;

      friendlyErrorConstructorValues.columnName = err.column_name;
      friendlyErrorConstructorValues.tableName = err.table_name;
      friendlyErrorConstructorValues.constraintName = err.constraint_name;

      return new FriendlyPostgresError({
        ...friendlyErrorConstructorValues,
        message:
          getMessage?.(friendlyErrorConstructorValues) ||
          friendlyErrorConstructorValues.message,
      });
    }
    case PG_ERROR_CODE.CodeUniqueViolation: {
      let columnName = matchPGErrorPart(columnRegexp, err.detail);

      if (columnName === "") {
        columnName = "value";
      }

      const valueName = matchPGErrorPart(valueRegexp, err.detail);

      friendlyErrorConstructorValues.message =
        valueName === ""
          ? `A ${columnName} already exists with that value`
          : `A ${columnName} already exists with this value (${valueName})`;

      friendlyErrorConstructorValues.tableName = err.table_name;

      if (columnName !== "value") {
        friendlyErrorConstructorValues.columnName = columnName;
      }

      friendlyErrorConstructorValues.constraintName = err.constraint_name;

      return new FriendlyPostgresError({
        ...friendlyErrorConstructorValues,
        message:
          getMessage?.(friendlyErrorConstructorValues) ||
          friendlyErrorConstructorValues.message,
      });
    }
    case PG_ERROR_CODE.CodeCheckViolation: {
      if (err.constraint_name?.length) {
        const c = constraintMap.get(err.constraint_name);

        return c?.getError(err);
      }

      friendlyErrorConstructorValues.tableName = err.table_name;
      friendlyErrorConstructorValues.columnName = err.column_name;
      friendlyErrorConstructorValues.constraintName = err.constraint_name;

      return new FriendlyPostgresError({
        ...friendlyErrorConstructorValues,
        message:
          getMessage?.(friendlyErrorConstructorValues) ||
          friendlyErrorConstructorValues.message,
      });
    }
    default: {
      friendlyErrorConstructorValues.routine = err.routine;

      friendlyErrorConstructorValues.tableName = err.table_name;
      friendlyErrorConstructorValues.columnName = err.column_name;
      friendlyErrorConstructorValues.constraintName = err.constraint_name;

      return new FriendlyPostgresError(friendlyErrorConstructorValues);
    }
  }
}

function matchPGErrorPart(regexp: RegExp, str?: string) {
  if (!str?.length) {
    return "";
  }

  const match = str.match(regexp);

  if (!match?.length || match.length < 2) {
    return "";
  }

  return match[1];
}
