import { Show } from "solid-js";

import { ProfilePageEmptyMessage } from "~/components/profile-page-empty-message";

import { sample } from "~/lib/utils/common";

// TODO: DIFFERENT MESSAGES FOR VISITOR AND SAME SESSION
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

export default function ActorConnections() {
  return (
    <Show
      when={false}
      fallback={
        <ProfilePageEmptyMessage
          title={sample(NO_DATA_MESSAGES.title)}
          description={sample(NO_DATA_MESSAGES.description)}
        >
          <div>Explore | Suggest who to follow</div>
        </ProfilePageEmptyMessage>
      }
    >
      Connections list
    </Show>
  );
}
