import { Show } from "solid-js";

import { Composer } from "~/components/composer/composer";
import { useSession } from "~/components/context/session";
import { RecordFeed } from "~/components/record-feed";

export default function Home() {
  const { actor } = useSession();

  return (
    <div class="space-y-layout py-layout">
      <Show when={actor()}>
        <Composer />
      </Show>

      <RecordFeed recordList={new Array(10)} />
    </div>
  );
}
