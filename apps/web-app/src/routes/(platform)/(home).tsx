import { For, Show } from "solid-js";

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

      {/* <RecordFeed recordList={new Array(10)} /> */}
    </div>
  );
}

{
  /* <section class="text-center space-y-4 py-4">
  <header class="space-y-2">
    <h2 class="text-lg font-semibold leading-none tracking-tight">
      Welcome to Kameleon!
    </h2>
    <p class="text-sm text-muted-foreground">
      Find some people to connect with and you'll see their updates here.
    </p>
  </header>
  <div class="flex justify-center gap-3">
    <For each={new Array(5)}>
      {(i) => <div class="w-16 h-16 bg-muted rounded-full"></div>}
    </For>
  </div>
</section> */
}
