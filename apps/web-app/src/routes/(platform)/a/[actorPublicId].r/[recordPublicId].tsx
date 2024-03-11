import { useParams } from "@solidjs/router";
import { For } from "solid-js";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export default function Record() {
  const params = useParams();

  return (
    <div class="relative no-layout-space">
      <div class="sticky-header border-b border-border py-layout">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            history.back();
          }}
        >
          <Icon.arrow.left class="text-base" />
          Back
        </Button>
      </div>

      <div>record - {params.recordPublicId}</div>

      <div>
        <For each={new Array(50)}>
          {() => <div>reply - {params.recordPublicId}</div>}
        </For>
      </div>
    </div>
  );
}
