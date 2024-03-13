import { A, useNavigate } from "@solidjs/router";
import { mergeProps } from "solid-js";

import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

import { paths } from "~/lib/constants/paths";

export type RecordProps = {
  config?: {
    navigateOnClick?: boolean;
    navigateOnAuxClick?: boolean;
  };
};

export function Record(originalProps: RecordProps) {
  const props = mergeProps(
    { config: { navigateOnClick: true, navigateOnAuxClick: true } },
    originalProps
  );

  const navigate = useNavigate();

  return (
    <article
      classList={{
        "relative flex flex-col gap-3 p-4 border border-border rounded-xl hover:border-muted-foreground/50":
          true,
        "cursor-pointer":
          props.config.navigateOnClick || props.config.navigateOnAuxClick,
      }}
      onClick={
        props.config.navigateOnClick
          ? () => {
              navigate(paths.actor("kameleon").record("test"));
            }
          : undefined
      }
      onAuxClick={
        props.config.navigateOnAuxClick
          ? () => {
              window.open(
                paths.actor("kameleon").record("random-record"),
                "_blank"
              );
            }
          : undefined
      }
    >
      <header class="flex justify-between items-center">
        <A
          href={paths.actor("kameleon").profile}
          class="inline-flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar fallback="K" rootClass="border border-background" />

          <div class="flex flex-col">
            <span class="font-semibold">KAMELEON</span>
            <span class="text-sm text-muted-foreground">30 min ago</span>
          </div>
        </A>

        <div>
          <Button
            size="sm"
            shape="squircle"
            variant="ghost"
            class="rounded-full border border-background"
          >
            <Icon.menuDots.solid />
          </Button>
        </div>
      </header>

      <div class="space-y-2">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis
          vehicula libero. Vestibulum convallis quam vitae ultrices interdum.
        </p>
        <p>
          In porta, nunc sed egestas sagittis, nisi nibh ullamcorper elit, vitae
          rutrum urna magna non tortor. Aliquam velit purus, pulvinar eget orci
          eget, vulputate ultricies nisi.
        </p>
      </div>

      <footer class="flex justify-between text-lg [&>div]-(flex gap-4.7)">
        <div>
          <Icon.arrow.up />
          <Icon.arrow.up class="rotate-180" />

          <Icon.eye.outline />
        </div>

        <div>
          <Icon.chat.square.outline />

          <Icon.chat.square.arrow.outline class="text-xl -mt-2px" />

          <Icon.share.outline />
          <Icon.bookmark.outline />
        </div>
      </footer>
    </article>
  );
}
