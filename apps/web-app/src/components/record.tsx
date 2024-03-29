import { A, useNavigate } from "@solidjs/router";
import { generateHTML } from "@tiptap/html";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { mergeProps } from "solid-js";

import { TEXT_EDITOR_EXTENSIONS } from "~/components/composer/composer";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

import { actors, recordVersions, records } from "~/server/db/schemas";

import { getShortName } from "~/lib/utils/actors";

import { paths } from "~/lib/constants/paths";

export type RecordProps = typeof records.$inferSelect & {
  author: typeof actors.$inferSelect;
  latestVersion: typeof recordVersions.$inferSelect;
} & {
  config?: {
    navigateOnClick?: boolean;
    navigateOnAuxClick?: boolean;
  };

  class?: string;
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
        "group/article relative flex flex-col gap-3 p-4 border border-border rounded-xl hover:border-muted-foreground/50":
          true,
        "cursor-pointer":
          props.config.navigateOnClick || props.config.navigateOnAuxClick,
        [props.class!]: Boolean(props.class),
      }}
      onClick={
        props.config.navigateOnClick
          ? () => {
              navigate(paths.actor(props.author.pid).record(props.pid));
            }
          : undefined
      }
      onAuxClick={
        props.config.navigateOnAuxClick
          ? () => {
              window.open(
                paths.actor(props.author.pid).record(props.pid),
                "_blank"
              );
            }
          : undefined
      }
    >
      <header class="flex justify-between items-center">
        <A
          href={paths.actor(props.author.pid).profile}
          class="group/actor inline-flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar
            fallback={getShortName(props.author.name || "")}
            rootClass="border border-background"
          />

          <div class="flex flex-col gap-1">
            <span class="font-semibold group-hover/actor:underline leading-none">
              {props.author.name}
            </span>
            <span class="text-sm text-muted-foreground leading-none">
              {formatDistanceToNow(new Date(props.createdAt), {
                includeSeconds: true,
              }).replace("about ", "")}{" "}
              ago
            </span>
          </div>
        </A>

        <div>
          <Button
            size="sm"
            variant="ghost"
            class="rounded-full border border-background"
            iconOnly
          >
            <Icon.menuDots.solid />
          </Button>
        </div>
      </header>

      <div
        class="space-y-2"
        innerHTML={
          props.latestVersion
            ? generateHTML(props.latestVersion.content, TEXT_EDITOR_EXTENSIONS)
            : "DEAL WITH THIS"
        }
      />

      <footer class="flex justify-between -m-2 text-lg text-muted-foreground [&>div>button]:group-hover/article:text-foreground [&>div>button]-(rounded-full px-0 aspect-square) [&>div>button>svg]-(text-lg) [&>div]-(flex gap-0.5)">
        <div>
          <Button variant="ghost" iconOnly onClick={(e) => e.stopPropagation()}>
            <Icon.arrow.up />
          </Button>
          <Button variant="ghost" iconOnly onClick={(e) => e.stopPropagation()}>
            <Icon.arrow.up class="rotate-180" />
          </Button>
          <Button variant="ghost" iconOnly onClick={(e) => e.stopPropagation()}>
            <Icon.eye.outline />
          </Button>
        </div>

        <div>
          <Button variant="ghost" iconOnly onClick={(e) => e.stopPropagation()}>
            <Icon.chat.square.outline />
          </Button>
          <Button variant="ghost" iconOnly onClick={(e) => e.stopPropagation()}>
            <Icon.chat.square.arrow.outline class="!text-xl -mt-2px" />
          </Button>
          <Button variant="ghost" iconOnly onClick={(e) => e.stopPropagation()}>
            <Icon.share.outline />
          </Button>
          <Button variant="ghost" iconOnly onClick={(e) => e.stopPropagation()}>
            <Icon.bookmark.outline />
          </Button>
        </div>
      </footer>
    </article>
  );
}
