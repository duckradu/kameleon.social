import { useAction } from "@solidjs/router";
import { JSONContent } from "@tiptap/core";
import { createSignal } from "solid-js";

import { TextEditor } from "~/components/composer/text-editor";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

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

export function Composer() {
  const [editorJSON, setEditorJSON] = createSignal<JSONContent>();

  const submitRecord = useAction(createRecord);

  return (
    <div class="flex flex-col gap-3 p-4 border border-border rounded-xl hover:border-muted-foreground/50 focus-within:border-muted-foreground/50">
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
        onClick={() => submitRecord(editorJSON()!)}
      >
        <Icon.signature.outline class="text-lg -ml-1" />
        Post
      </Button>
    </div>
  );
}
