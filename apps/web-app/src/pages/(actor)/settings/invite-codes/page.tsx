import { A, RouteDefinition, createAsyncStore } from "@solidjs/router";
import { format } from "date-fns/format";
import { For, createMemo } from "solid-js";

import { SettingsSection } from "~/components/settings-section";
import { Icon } from "~/components/ui/icon";

import {
  createInviteCode,
  deleteInviteCode,
  getInviteCodes,
} from "~/server/modules/invite-codes/actions";

import { MAX_INVITE_CODES_PER_ACTOR } from "~/server/modules/invite-codes/constants";

function c(n: number, word: { singular: string; plural: string }) {
  if (n === 1) {
    return word.singular;
  }

  return word.plural;
}

export const route = {
  load: () => getInviteCodes(),
} satisfies RouteDefinition;

export default function SettingsInviteCodes() {
  const inviteCodes = createAsyncStore(() => getInviteCodes(), {
    reconcile: {
      key: "code",
    },
  });
  const nInviteCodesLeft = createMemo(
    () => MAX_INVITE_CODES_PER_ACTOR - (inviteCodes()?.data?.length || 0)
  );

  // TODO: Replace hardcoded strings
  return (
    <div class="py-2 space-y-4 w-full">
      <SettingsSection
        header="Invite codes"
        description={`You have ${nInviteCodesLeft()} invite ${c(
          nInviteCodesLeft(),
          {
            singular: "code",
            plural: "codes",
          }
        )}`}
        quickActions={() => (
          // TODO: Make it pretty
          <form action={createInviteCode} method="post">
            <button class="bg-transparent">
              <Icon.plus />
            </button>
          </form>
        )}
      >
        {/* TODO: Replace with a slider */}
        <ul class="grid grid-cols-2 gap-2">
          <For each={inviteCodes()?.data}>
            {(inviteCode) => (
              <li>
                <div class="bg-gradient-to-tr from-brand to-green rounded-md p-1">
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

                    <ul class="p-2 [&>li>p]-(uppercase text-muted-foreground text-xs font-medium) [&>li>strong]:font-medium">
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
                      <li>
                        <p>Used by (0/{inviteCode.availableUses})</p>
                        <strong>2 ppl</strong>
                      </li>
                    </ul>
                    <form
                      action={deleteInviteCode}
                      method="post"
                      class="absolute bottom-0 right-0 !border-0"
                    >
                      <input
                        name="inviteCode"
                        type="hidden"
                        value={inviteCode.code}
                      />
                      <button class="bg-transparent">
                        <Icon.trashBin.outline />
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            )}
          </For>
        </ul>
      </SettingsSection>
    </div>
  );
}
