import { RouteDefinition, createAsync, useParams } from "@solidjs/router";

import { findOneByPID } from "~/server/modules/actors/actions";

export const route = {
  load: ({ params }) => findOneByPID(params.publicId),
} satisfies RouteDefinition;

export default function Actor() {
  const params = useParams();

  const actor = createAsync(() => findOneByPID(params.publicId));

  return (
    <div>
      <div
        class="bg-foreground/10 rounded-b-xl bg-cover bg-center"
        style={{
          height: "calc((100vw - 240px) / 5)",
        }}
      ></div>

      <h1>{actor()?.name}</h1>
    </div>
  );
}
