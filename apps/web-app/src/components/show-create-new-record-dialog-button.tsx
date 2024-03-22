import { createMemo, mergeProps } from "solid-js";

import { Composer } from "~/components/composer/composer";
import { Button, ButtonProps } from "~/components/ui/button";
import { Dialog, DialogProps } from "~/components/ui/dialog";
import { Icon } from "~/components/ui/icon";

export type ShowCreateNewRecordDialogButtonProps = {
  buttonProps?: Omit<ButtonProps, "onClick">;
  dialogProps?: Omit<DialogProps, "trigger">;
};

export function ShowCreateNewRecordDialogButton(
  originalProps: ShowCreateNewRecordDialogButtonProps
) {
  const buttonProps = createMemo(() =>
    mergeProps(
      {
        size: "lg",
        children: (
          <>
            <Icon.signature.outline class="text-lg -ml-1" />
            Post
          </>
        ),
      },
      originalProps.buttonProps
    )
  );
  const dialogProps = createMemo(() =>
    mergeProps(
      {
        size: "xl",
        contentClass: "p-0",
      },
      originalProps.dialogProps
    )
  );

  return (
    <Dialog
      trigger={(triggerProps) => (
        <Button
          {...triggerProps}
          {...(buttonProps() as ShowCreateNewRecordDialogButtonProps["buttonProps"])}
        />
      )}
      {...(dialogProps() as ShowCreateNewRecordDialogButtonProps["dialogProps"])}
    >
      {({ close }) => <Composer onSuccess={() => close()} class="border-0" />}
    </Dialog>
  );
}
