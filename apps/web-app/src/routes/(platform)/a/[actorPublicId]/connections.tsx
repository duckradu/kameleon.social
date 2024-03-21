import { useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { useSession } from "~/components/context/session";
import { ProfilePageEmptyMessage } from "~/components/profile-page-empty-message";

import { sample } from "~/lib/utils/common";

const NO_DATA_MESSAGES = {
  title: [
    "Feels a little empty here",
    "Welcome to your network!",
    "New to the community?",
    "Welcome to the social scene!",
  ],
  description: [
    "Let's start building meaningful connections...",
    "Your connections count may be zero now, but every great journey starts somewhere!",
    "Your connections list is ready for growth...",
    "Your network is waiting to expand! Start connecting with like-minded individuals...",
    "From 0 to a thriving network! Your connections list is ready for action...",
    "Your connections are waiting to be made! Let's start building bridges...",
    "Your connections list is your key to community...",
    "Zero connections now, but soon your network will be buzzing with activity!",
  ],
};

const NO_DATA_MESSAGES_VISITOR = {
  title: (actorPublicId: string) => [
    `@${actorPublicId}'s connections list is empty for now.`,
    `Currently, there are no connections for @${actorPublicId}.`,
    `Zero connections for @${actorPublicId} at the moment.`,
    `No connections yet for @${actorPublicId}.`,
    `@${actorPublicId} hasn't made any connections yet.`,
    `Empty connections list for @${actorPublicId} right now.`,
    `Awaiting @${actorPublicId}'s first connections.`,
  ],
  description: [
    "When someone follows this account, they'll be displayed here.",
    "Once someone follows, their profile will appear here.",
    "New connections will populate this section.",
    "New followers will populate this section.",
    "Once someone follows, they'll show up here.",
  ],
};

export default function ActorConnections() {
  const params = useParams();
  const { actor } = useSession();

  const isSessionActor = params.actorPublicId === actor()?.pid;

  return (
    <Show
      when={false}
      fallback={
        <ProfilePageEmptyMessage
          title={
            isSessionActor
              ? sample(NO_DATA_MESSAGES.title)
              : sample(NO_DATA_MESSAGES_VISITOR.title(params.actorPublicId))
          }
          description={
            isSessionActor
              ? sample(NO_DATA_MESSAGES.description)
              : sample(NO_DATA_MESSAGES_VISITOR.description)
          }
        >
          <Show when={isSessionActor}>
            <div>Explore | Suggest who to connect with</div>
          </Show>
        </ProfilePageEmptyMessage>
      }
    >
      Connections list
    </Show>
  );
}
