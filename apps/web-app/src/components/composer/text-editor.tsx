import { EditorOptions, Extensions } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Hardbreak from "@tiptap/extension-hard-break";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { createMemo } from "solid-js";
import { createTiptapEditor } from "solid-tiptap";

export type TextEditorProps = {
  placeholder?: string;

  onUpdate?: EditorOptions["onUpdate"];

  class?: string;
};

export function TextEditor(props: TextEditorProps) {
  let textEditorRef!: HTMLDivElement;

  const extensions = createMemo<Extensions>(() => [
    Document,
    Paragraph,
    Placeholder.configure({ placeholder: props.placeholder }),
    Text,
    History,
    Hardbreak,
  ]);

  createTiptapEditor(() => ({
    element: textEditorRef,
    extensions: extensions(),
    onUpdate: props.onUpdate,
  }));

  return <div ref={textEditorRef} id="text-editor" class={props.class} />;
}
