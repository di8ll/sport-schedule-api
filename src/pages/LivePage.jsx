import LiveStream from "../components/LiveStream";

const LivePage = ({ matches }) => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
    <LiveStream matches={matches} />
  </div>
);

export default LivePage;
