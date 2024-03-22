import { useAction, useSubmission } from "@solidjs/router";
import { JSONContent } from "@tiptap/core";
import { Show, createSignal, onCleanup, onMount } from "solid-js";

import { TextEditor } from "~/components/composer/text-editor";
import { Button } from "~/components/ui/button";
import { FormFieldHelper } from "~/components/ui/form-field-helper";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import { TriggerToast } from "~/components/ui/toast";

import { records } from "~/server/db/schemas";
import { createRecord } from "~/server/modules/records/actions";

import { sample } from "~/lib/utils/common";

const PLACEHOLDER_MESSAGES = [
  "Share your thoughts...",
  "Start a conversation...",
  "What's on your mind?",
  "Tell us something...",
  "Compose your thoughts...",
  "Share with the community...",
  "What's new in your life?",
  "Got something interesting to say?",
  "Spark a discussion...",
  "Start you story...",
  "Share your ideas...",
  "Engage with the world...",
  "Express yourself...",
  "Say it loud...",
];

export type ComposerProps = {
  parentRecordId?: (typeof records.$inferInsert)["parentRecordId"];

  class?: string;
};

export function Composer(props: ComposerProps) {
  const [editorJSON, setEditorJSON] = createSignal<JSONContent>();
  const [showSlugEdit, setShowSlugEdit] = createSignal(false);

  const submitRecord = useAction(createRecord);
  const submission = useSubmission(createRecord);

  onMount(() => {
    onCleanup(() => {
      submission.clear?.();
    });
  });

  return (
    <>
      <Show when={submission.result?.error}>
        <TriggerToast
          title="Uh oh! Something went wrong."
          description={submission.result?.error}
          type="error"
        />
      </Show>
      <div
        classList={{
          "flex flex-col gap-3 p-4 border border-border rounded-xl hover:border-muted-foreground/50 focus-within:border-muted-foreground/50":
            true,
          [props.class!]: Boolean(props.class),
        }}
      >
        <div class="space-y-4">
          <TextEditor
            placeholder={sample(PLACEHOLDER_MESSAGES)}
            onUpdate={({ editor }) => {
              const json = editor.getJSON();

              setEditorJSON(json);
            }}
            class="min-h-6 ![&>div]-(ring-none outline-transparent)"
          />

          <Show when={showSlugEdit()}>
            <div class="flex flex-col py-4 border-y border-border">
              <div class="grid gap-1">
                <Input placeholder="URL" />
                <FormFieldHelper>
                  https://kameleon.social/a/kameleon/r/test
                </FormFieldHelper>
              </div>
            </div>
          </Show>
        </div>

        <div class="flex justify-between items-center gap-3">
          <div class="-ml-2.5">
            <Button
              variant="ghost"
              class={[
                "rounded-full aspect-square",
                showSlugEdit() && "text-foreground",
              ]
                .filter(Boolean)
                .join(" ")}
              iconOnly
              onClick={() => setShowSlugEdit((p) => !p)}
            >
              <Icon.link.outline />
            </Button>
          </div>

          <Button
            onClick={() =>
              submitRecord({
                record: {
                  parentRecordId: props.parentRecordId,
                },
                recordVersion: {
                  content: editorJSON()!,
                },
              })
            }
          >
            <Icon.signature.outline class="text-lg -ml-1" />
            <Show when={props.parentRecordId} fallback="Post">
              Reply
            </Show>
          </Button>
        </div>
      </div>
    </>
  );
}
