import Schedule from "../components/Schedule";

const JadwalPage = ({ matches }) => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
    <Schedule matches={matches} />
  </div>
);

export default JadwalPage;
