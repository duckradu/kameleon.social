import { RouteSectionProps } from "@solidjs/router";
import {
  createEffect,
  createSignal,
  onCleanup,
  Show,
  Suspense,
} from "solid-js";

import {
  RecordRouteProvider,
  useRecordRoute,
} from "~/components/context/record-route";
import { Record as RecordComponent } from "~/components/record";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export default function Record(props: RouteSectionProps) {
  const [noScrollY, setNoScrollY] = createSignal(true);

  createEffect(() => {
    const event = "scroll";
    const callback = () => {
      if (window.scrollY === 0 && noScrollY() === false) {
        setNoScrollY(true);
      }
      if (window.scrollY !== 0 && noScrollY() === true) {
        setNoScrollY(false);
      }
    };

    window.addEventListener(event, callback);

    onCleanup(() => window.removeEventListener(event, callback));
  });

  return (
    <RecordRouteProvider>
      <div class="relative space-y-layout">
        <div
          classList={{
            "sticky-header py-layout z-10 border-b": true,

            "border-transparent": noScrollY(),
            "border-border": !noScrollY(),
          }}
        >
          <Button variant="secondary" onClick={() => history.back()}>
            <Icon.arrow.left class="text-base" />
            Back
          </Button>
        </div>

        <ViewRouteRecord />

        <Suspense
          fallback={
            <div class="py-8 h-full">
              <Icon.spinner class="text-2xl animate-spin mx-auto" />
            </div>
          }
        >
          {props.children}
        </Suspense>
      </div>
    </RecordRouteProvider>
  );
}

function ViewRouteRecord() {
  const { record } = useRecordRoute();

  return (
    <Show
      when={record()}
      fallback={
        <div class="!mt-0 py-8 h-full border border-border rounded-xl">
          <Icon.spinner class="text-2xl animate-spin mx-auto" />
        </div>
      }
    >
      <RecordComponent
        {...record()!.data!}
        config={{ navigateOnClick: false, navigateOnAuxClick: false }}
        class="!mt-0"
      />
    </Show>
  );
}
