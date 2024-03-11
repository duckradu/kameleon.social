import { For } from "solid-js";

export default function ActorActivity() {
  return (
    <div>
      <For each={new Array(50)}>
        {() => (
          <div>
            activity - activity - activity - activity - activity - activity -{" "}
          </div>
        )}
      </For>
    </div>
  );
}
