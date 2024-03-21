import { For } from "solid-js";

import { Record } from "~/components/record";

import { recordVersions, records } from "~/server/db/schemas";

export type RecordFeedProps = {
  recordList: (typeof records.$inferSelect & {
    latestVersion: typeof recordVersions.$inferSelect;
  })[];

  class?: string;
};

export function RecordFeed(props: RecordFeedProps) {
  return (
    <div
      classList={{
        "grid gap-layout": true,
        [props.class!]: Boolean(props.class),
      }}
    >
      <For each={props.recordList}>{(record) => <Record {...record} />}</For>
    </div>
  );
}
