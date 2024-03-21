import { useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { useSession } from "~/components/context/session";
import { ProfilePageEmptyMessage } from "~/components/profile-page-empty-message";
import { Button } from "~/components/ui/button";

import { sample } from "~/lib/utils/common";

const NO_DATA_MESSAGES = {
  title: [
    "Lights, camera, action!",
    "New to the scene?",
    "Welcome to your moments!",
    "Capture life's magic!",
    "Welcome to your digital space!",
  ],
  description: [
    "Your moments section is waiting...",
    "Time to create your first masterpiece...",
    "Your moments section is your canvas for creativity...",
    "Let your story unfold...",
    "Welcome to the spotlight! This is your stage...",
    "Time to start collecting memories...",
    "Your moments tab is empty for now...",
    "Let's fill it with moments...",
  ],
};

const NO_DATA_MESSAGES_VISITOR = {
  title: (actorPublicId: string) => [
    `No moments from @${actorPublicId} just yet.`,
    `Currently, @${actorPublicId} hasn't added any moments.`,
    `The moments section for @${actorPublicId} is empty.`,
    `Zero moments from @${actorPublicId} right now.`,
    `Still waiting for @${actorPublicId}'s first moment.`,
    `The moments feed from @${actorPublicId} is currently empty.`,
    `Nothing to see in the moments section for @${actorPublicId} yet.`,
    `Awaiting @${actorPublicId}'s first moments.`,
  ],
  description: [
    "Stay tuned for their first ones to appear here.",
    "Keep an eye out for their updates!",
    "Once they start sharing, you'll see them here.",
    "We'll update this space when they share.",
    "Once they post one, it'll be visible here.",
    "We'll showcase their posts here once they share.",
    "But when they start posting, you'll see them here!",
    "Once they share, you'll find them here!",
  ],
};

export default function ActorMoments() {
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
            <Button size="lg">Post a Moment</Button>
          </Show>
        </ProfilePageEmptyMessage>
      }
    >
      Moments feed
    </Show>
  );
}
