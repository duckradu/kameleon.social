import { Navigate, RouteSectionProps, useLocation } from "@solidjs/router";

export default function Settings() {
  const location = useLocation();

  return <Navigate href={`${location.pathname}/invite-codes`} />;
}
