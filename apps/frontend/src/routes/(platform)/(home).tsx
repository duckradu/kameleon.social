import { For } from "solid-js";

export default function HomePage() {
  return (
    <div class="grid gap-3 py-3">
      <For each={new Array(50)}>
        {() => (
          <div class="flex p-4 border rounded-xl">
            TODO: add rate limiter to BE
          </div>
        )}
      </For>
    </div>
  );
}
