import { createAsync } from "@solidjs/router";

import { api } from "~/lib/api";

export default function HomePage() {
  const rs = createAsync(() => api.example.hello.query());

  return (
    <div>
      <h1>Home</h1>
      <pre>{JSON.stringify(rs(), null, 2)}</pre>
    </div>
  );
}
