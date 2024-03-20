import { createSignal } from "solid-js";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { TextEditor } from "~/components/composer/text-editor";

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
  const [editorJSON, setEditorJSON] = createSignal<object>();

  return (
    <form
      action={undefined}
      method="post"
      class="flex flex-col gap-3 p-4 border border-border rounded-xl hover:border-muted-foreground/50 focus-within:border-muted-foreground/50"
    >
      <input
        name="recordContent"
        type="hidden"
        value={editorJSON()?.toString()}
      />

      <TextEditor
        placeholder={PLACEHOLDER_MESSAGES[0]}
        onUpdate={({ editor }) => {
          const json = editor.getJSON();

          console.log(json);
        }}
        class="min-h-6 ![&>div]-(ring-none outline-transparent)"
      />

      <Button size="lg" type="submit" class="self-end">
        <Icon.signature.outline class="text-lg -ml-1" />
        Post
      </Button>
    </form>
  );
}
