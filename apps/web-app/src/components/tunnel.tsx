import {
  For,
  JSX,
  ParentProps,
  Show,
  createRenderEffect,
  createSignal,
  createUniqueId,
  onCleanup,
} from "solid-js";

export function tunnel() {
  const [state, setState] = createSignal<
    { id: string; children: JSX.Element }[]
  >([]);

  return {
    In: (props: ParentProps) => {
      const uniqueId = createUniqueId();

      createRenderEffect(() => {
        setState((state) => [
          ...state,
          { id: uniqueId, children: props.children },
        ]);
      });

      onCleanup(() => {
        setState((state) => state.filter((c) => c.id !== uniqueId));
      });

      return null;
    },
    Out: ({ fallback }: { fallback?: JSX.Element }) => (
      <>
        <Show when={state().length} fallback={fallback}>
          <For each={state()}>{(c) => c.children}</For>
        </Show>
      </>
    ),
  };
}
