"use server";

import { redirect } from "@solidjs/router";
import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { actors } from "~/server/db/schemas/actors";

import { serverErrorResponse, serverSuccessResponse } from "~/lib/utils/server";
import { to } from "~/lib/utils/common";

import { paths } from "~/lib/constants/paths";

export async function findOneByPID$(pid: string) {
  "use server";

  const [err, matchingActor] = await to(
    db.select().from(actors).where(eq(actors.pid, pid))
  );

  if (err) {
    // make a 500 page
    throw redirect(paths.notFound);
    // return serverErrorResponse(err);
  }

  if (!matchingActor[0]) {
    throw redirect(paths.notFound);
  }

  return matchingActor[0];
}
