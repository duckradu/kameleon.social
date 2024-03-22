import { createForm, getValue, valiForm } from "@modular-forms/solid";
import { useAction, useSubmission } from "@solidjs/router";
import { JSONContent } from "@tiptap/core";
import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { Input, maxLength, minLength, object, regex, string } from "valibot";

import { TextEditor } from "~/components/composer/text-editor";
import { useSession } from "~/components/context/session";
import { Button } from "~/components/ui/button";
import { FormFieldError } from "~/components/ui/form-field-error";
import { FormFieldHelper } from "~/components/ui/form-field-helper";
import { Icon } from "~/components/ui/icon";
import { Input as InputComponent } from "~/components/ui/input";
import { TriggerToast } from "~/components/ui/toast";

import { records } from "~/server/db/schemas";
import { createRecord } from "~/server/modules/records/actions";

import { getBaseUrl, nanoid, noop, sample } from "~/lib/utils/common";

import { paths } from "~/lib/constants/paths";

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

const RecordDetailsSchema = object({
  pid: string([
    minLength(1, "Please enter a valid slug"),
    maxLength(90, "The slug can't have more than 90 characters"),
    regex(/^[A-z0-9]+(?:-[A-z0-9]+)*$/, "The slug is badly formatted"),
  ]),
});

export type ComposerProps = {
  parentRecordId?: (typeof records.$inferInsert)["parentRecordId"];

  class?: string;
};

export function Composer(props: ComposerProps) {
  const { actor } = useSession();
  const [editorJSON, setEditorJSON] = createSignal<JSONContent>();
  const [recordDetailsFormStore, RecordDetails] = createForm<
    Input<typeof RecordDetailsSchema>
  >({
    initialValues: {
      pid: nanoid(),
    },

    validate: valiForm(RecordDetailsSchema),

    validateOn: "input",
  });
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
            <RecordDetails.Form
              onSubmit={noop}
              class="flex flex-col py-4 border-y border-border"
            >
              <RecordDetails.Field name="pid">
                {(field, props) => (
                  <div class="grid gap-1">
                    <InputComponent value={field.value} {...props} />
                    <Show when={field.error}>
                      <FormFieldError>{field.error}</FormFieldError>
                    </Show>
                    <FormFieldHelper>
                      {`${getBaseUrl()}${paths
                        .actor(actor()!.pid)
                        .record(field.value || "")}`}
                    </FormFieldHelper>
                  </div>
                )}
              </RecordDetails.Field>
            </RecordDetails.Form>
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
                  pid: getValue(recordDetailsFormStore, "pid"),
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
