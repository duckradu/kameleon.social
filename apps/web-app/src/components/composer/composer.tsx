import { useAction, useSubmission } from "@solidjs/router";
import { JSONContent } from "@tiptap/core";
import { Show, createSignal } from "solid-js";

import { TextEditor } from "~/components/composer/text-editor";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
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

  const submitRecord = useAction(createRecord);
  const submission = useSubmission(createRecord);

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
        <TextEditor
          placeholder={sample(PLACEHOLDER_MESSAGES)}
          onUpdate={({ editor }) => {
            const json = editor.getJSON();

            setEditorJSON(json);
          }}
          class="min-h-6 ![&>div]-(ring-none outline-transparent)"
        />

        <Button
          size="lg"
          class="self-end"
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
    </>
  );
}
