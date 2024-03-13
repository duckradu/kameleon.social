import { RecordFeed } from "~/components/record-feed";

export default function Home() {
  return <RecordFeed recordList={new Array(10)} class="py-layout" />;
}
