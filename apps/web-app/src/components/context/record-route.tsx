import { cache, createAsync, redirect, useParams } from "@solidjs/router";
import { Accessor, ParentProps, createContext, useContext } from "solid-js";

import { useActorRoute } from "~/components/context/actor-route";

import { actors, records } from "~/server/db/schemas";

import { db } from "~/server/db";

import { rpcSuccessResponse } from "~/lib/utils/rpc";

import { paths } from "~/lib/constants/paths";

const routeData = cache(
  async (
    actorId: (typeof actors.$inferInsert)["id"],
    recordPublicId: (typeof records.$inferSelect)["pid"]
  ) => {
    "use server";

    //? Not sure about this but it does the trick
    if (!actorId) {
      return undefined;
    }

    const matchingRecord = await db.query.records.findFirst({
      where: (records, { and, eq }) =>
        and(eq(records.authorId, actorId), eq(records.pid, recordPublicId)),
      with: {
        author: true,
        versions: {
          orderBy: (recordVersions, { desc }) => [
            desc(recordVersions.createdAt),
          ],
          limit: 1,
        },
        // TODO: Add parentRecord here
      },
    });

    if (!matchingRecord) {
      throw redirect(paths.notFound);
    }

    const { versions, ...record } = matchingRecord;

    return rpcSuccessResponse({
      ...record,
      latestVersion: versions[0],
    });
  },
  "record:route"
);

export type IRecordRouteContext = {
  record: Accessor<Awaited<ReturnType<typeof routeData>> | undefined>;
};

const RecordRouteContext = createContext<IRecordRouteContext>();

export function RecordRouteProvider(props: ParentProps) {
  const params = useParams();

  const { actor } = useActorRoute();

  const record = createAsync(() =>
    routeData(actor()?.data?.id, params.recordPublicId)
  );

  return (
    <RecordRouteContext.Provider value={{ record }}>
      {props.children}
    </RecordRouteContext.Provider>
  );
}

export function useRecordRoute() {
  const context = useContext(RecordRouteContext);

  if (context === undefined) {
    throw new Error(
      "`useRecordRoute` must be used within a RecordRouteProvider"
    );
  }

  return context;
}
