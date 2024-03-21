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

export const TEXT_EDITOR_EXTENSIONS = [
  Document,
  Paragraph,
  Text,
  History,
  Hardbreak,
] satisfies Extensions;

export function TextEditor(props: TextEditorProps) {
  let textEditorRef!: HTMLDivElement;

  const extensions = createMemo<Extensions>(() => [
    ...TEXT_EDITOR_EXTENSIONS,
    Placeholder.configure({ placeholder: props.placeholder }),
  ]);

  createTiptapEditor(() => ({
    element: textEditorRef,
    extensions: extensions(),
    onUpdate: props.onUpdate,
  }));

  return <div ref={textEditorRef} id="text-editor" class={props.class} />;
}
