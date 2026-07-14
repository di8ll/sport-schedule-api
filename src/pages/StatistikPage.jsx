import Stats from "../components/Stats";

const StatistikPage = ({ matches }) => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
    <Stats matches={matches} />
  </div>
);

export default StatistikPage;
