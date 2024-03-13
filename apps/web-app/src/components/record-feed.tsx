import { For } from "solid-js";

import { Record } from "~/components/record";

export type RecordFeedProps = {
  recordList: any[];

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
      <For each={props.recordList}>{() => <Record />}</For>
    </div>
  );
}
