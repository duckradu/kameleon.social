import { createEffect, createSignal, onCleanup } from "solid-js";

import { Record as RecordComponent } from "~/components/record";
import { RecordFeed } from "~/components/record-feed";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export default function Record() {
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
    <div class="relative space-y-layout">
      <div
        classList={{
          "sticky-header py-layout z-10 border-b": true,

          "border-transparent": noScrollY(),
          "border-border": !noScrollY(),
        }}
      >
        <Button
          variant="secondary"
          onClick={() => {
            history.back();
          }}
        >
          <Icon.arrow.left class="text-base" />
          Back
        </Button>
      </div>

      <RecordComponent
        config={{ navigateOnClick: false, navigateOnAuxClick: false }}
        class="!mt-0"
      />

      <div class="flex justify-between items-center no-space-layout -my-1">
        <h2 class="text-2xl font-bold">Replies</h2>
        <Button size="lg">
          <Icon.signature.outline class="text-lg -ml-1" />
          Reply
        </Button>
      </div>

      <RecordFeed recordList={new Array(10)} />
    </div>
  );
}
