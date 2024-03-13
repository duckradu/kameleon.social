import { RecordFeed } from "~/components/record-feed";

export default function Home() {
  return (
    <div class="no-layout-space">
      <RecordFeed recordList={new Array(10)} />
    </div>
  );
}
