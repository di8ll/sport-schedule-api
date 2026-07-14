import Lineup from "../components/Lineup";

const LineupPage = ({ matches }) => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
    <Lineup matches={matches} />
  </div>
);

export default LineupPage;
