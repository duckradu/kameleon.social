import {
  A,
  RouteDefinition,
  cache,
  createAsyncStore,
  useSubmission,
} from "@solidjs/router";
import { format } from "date-fns/format";
import { For, Show, createMemo } from "solid-js";

import { SettingsSection } from "~/components/settings-section";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { TriggerToast } from "~/components/ui/toast";

import {
  createInviteCode,
  deleteInviteCode,
  toggleInviteCodeIsEnabled,
} from "~/server/modules/invite-codes/actions";
import { MAX_INVITE_CODES_PER_ACTOR } from "~/server/modules/invite-codes/constants";
import { getInviteCodes$ } from "~/server/modules/invite-codes/rpc";

import { paths } from "~/lib/constants/paths";
import { getShortName } from "~/lib/utils/actors";
import { dynamicWord } from "~/lib/utils/common";

const routeData = cache(getInviteCodes$, "view-invite-codes");

export const route = {
  load: () => routeData(),
} satisfies RouteDefinition;

export default function SettingsInviteCodes() {
  const inviteCodes = createAsyncStore(() => routeData(), {
    reconcile: {
      key: "code",
    },
  });

  const toggleIsEnabledSubmission = useSubmission(toggleInviteCodeIsEnabled);
  const deleteSubmission = useSubmission(deleteInviteCode);

  const nInviteCodesLeft = createMemo(
    () => MAX_INVITE_CODES_PER_ACTOR - (inviteCodes()?.data?.length || 0)
  );

  return (
    <>
      <Show when={deleteSubmission.result?.error}>
        <TriggerToast
          title="Uh oh! Something went wrong."
          description={deleteSubmission.result?.error}
          type="error"
        />
      </Show>
      <div class="py-layout">
        <SettingsSection
          header="Invite codes"
          description={`You can create ${nInviteCodesLeft()} invite ${dynamicWord(
            nInviteCodesLeft(),
            {
              singular: "code",
              plural: "codes",
            }
          )}`}
          quickActions={
            nInviteCodesLeft() === 0
              ? undefined
              : () => (
                  <form action={createInviteCode} method="post">
                    <Button
                      type="submit"
                      size="sm"
                      variant="ghost"
                      class="rounded-full"
                      iconOnly
                    >
                      <Icon.plus class="text-base" />
                    </Button>
                  </form>
                )
          }
        >
          {/* TODO: Replace with a slider */}
          <ul class="grid grid-cols-2 gap-2">
            <For each={inviteCodes()?.data}>
              {(inviteCode) => (
                <li>
                  <div
                    classList={{
                      "bg-gradient-to-tr rounded-md p-1 hover:space-y-1 group":
                        true,

                      "from-brand to-green": inviteCode.isEnabled,
                      "from-gray to-gray": !inviteCode.isEnabled,
                    }}
                  >
                    <div class="bg-background rounded-sm flex divide-x divide-dashed divide-muted-foreground relative">
                      <A
                        href={inviteCode.signUpWithInviteCodeURL}
                        target="_blank"
                        class="block p-2 shrink-0"
                      >
                        <img
                          src={inviteCode.qrCodeDataURL}
                          class="w-full aspect-square mx-auto rounded"
                        />
                      </A>

                      <ul class="p-2 space-y-.5 [&>li>p]-(uppercase text-muted-foreground text-xs font-medium) [&>li>strong]:font-medium">
                        <li>
                          <p>Invite code</p>
                          <strong>{inviteCode.code}</strong>
                        </li>
                        <li>
                          <p>Valid until</p>
                          <strong>
                            {format(
                              new Date(inviteCode.expiresAt),
                              "dd MMM yyyy"
                            )}
                          </strong>
                        </li>
                        <Show when={inviteCode.usedBy.length}>
                          <li>
                            <p>
                              Used {inviteCode.usedBy.length}/
                              {inviteCode.availableUses}
                            </p>
                            <div class="flex -space-x-3">
                              <For each={inviteCode.usedBy}>
                                {(actor) => (
                                  <A href={paths.actor(actor.pid).profile}>
                                    <Avatar
                                      fallback={getShortName(actor.name || "")}
                                      rootClass="border border-background"
                                    />
                                  </A>
                                )}
                              </For>
                            </div>
                          </li>
                        </Show>
                      </ul>
                    </div>
                    <div class="flex justify-end gap-1 h-0 overflow-hidden group-hover:h-auto">
                      <form action={toggleInviteCodeIsEnabled} method="post">
                        <input
                          name="inviteCode"
                          type="hidden"
                          value={inviteCode.code}
                        />
                        <Button
                          type="submit"
                          size="sm"
                          variant="secondary"
                          class="rounded-full"
                          iconOnly
                        >
                          <Icon.forbidden.circle.outline class="text-base" />
                        </Button>
                      </form>
                      <form action={deleteInviteCode} method="post">
                        <input
                          name="inviteCode"
                          type="hidden"
                          value={inviteCode.code}
                        />
                        <Button
                          type="submit"
                          size="sm"
                          variant="secondary"
                          class="rounded-full"
                          iconOnly
                        >
                          <Icon.trashBin.outline class="text-base" />
                        </Button>
                      </form>
                    </div>
                  </div>
                </li>
              )}
            </For>
          </ul>
        </SettingsSection>
      </div>
    </>
  );
}
