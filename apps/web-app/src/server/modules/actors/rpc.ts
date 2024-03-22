"use server";

import { db } from "~/server/db";

export async function findOneByPID$(pid: string) {
  return await db.query.actors.findFirst({
    where: (actors, { eq }) => eq(actors.pid, pid),
  });
}
