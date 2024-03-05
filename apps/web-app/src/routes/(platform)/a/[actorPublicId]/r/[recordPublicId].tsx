import { useParams } from "@solidjs/router";

export default function Record() {
  const params = useParams();

  return <div>record page - {params.recordPublicId}</div>;
}
