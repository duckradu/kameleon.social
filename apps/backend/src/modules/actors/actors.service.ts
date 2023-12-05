import { InferSelectModel, eq } from "drizzle-orm";

import { db } from "~/db";

import { actors } from "~/modules/actors/actors.schema";

export async function findByEmail(
  email: InferSelectModel<typeof actors>["email"]
) {
  const matchingRecords = await db
    .select()
    .from(actors)
    .where(eq(actors.email, email));

  return matchingRecords;
}

export async function findByPublicId(
  publicId: InferSelectModel<typeof actors>["publicId"]
) {
  const matchingRecords = await db
    .select()
    .from(actors)
    .where(eq(actors.publicId, publicId));

  return matchingRecords;
}
