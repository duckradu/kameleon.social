import { Record as RecordComponent } from "~/components/record";
import { RecordFeed } from "~/components/record-feed";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export default function Record() {
  return (
    <div class="relative no-layout-space">
      <div class="sticky-header py-layout z-10">
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

      <div class="space-y-3">
        <RecordComponent
          config={{ navigateOnClick: false, navigateOnAuxClick: false }}
        />

        <div>
          <header class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">Replies</h2>
            <Button>
              <Icon.signature.outline class="text-lg -ml-1" />
              Reply
            </Button>
          </header>

          <RecordFeed recordList={new Array(10)} />
        </div>
      </div>
    </div>
  );
}
