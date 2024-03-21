import { Show } from "solid-js";

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

export default function ActorMoments() {
  return (
    <Show
      when={false}
      fallback={
        <ProfilePageEmptyMessage
          title={sample(NO_DATA_MESSAGES.title)}
          description={sample(NO_DATA_MESSAGES.description)}
        >
          <Button size="lg">Post a Moment</Button>
        </ProfilePageEmptyMessage>
      }
    >
      Moments feed
    </Show>
  );
}
