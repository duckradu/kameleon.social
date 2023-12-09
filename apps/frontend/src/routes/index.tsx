import { createRouteData, refetchRouteData, useRouteData } from "solid-start";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

import { xfetch } from "~/lib/xfetch";

export function routeData() {
  return createRouteData(async () => {
    const response = await xfetch("/api/v1/test", {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    });
    const data = await response.json();

    console.log(">>>", data);

    return data as { hello: "world" };
  });
}

export default function Home() {
  const data = useRouteData<typeof routeData>();

  return (
    <main class="flex items-center justify-center h-screen flex-col gap-8">
      <Icon.logo.solid class="w-10 h-10 text-foreground" />

      <span>Hello {data()?.hello}</span>

      <Button onClick={() => refetchRouteData()}>Refetch</Button>
    </main>
  );
}
