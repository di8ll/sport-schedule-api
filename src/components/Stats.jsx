const StatBar = ({ label, valueA, valueB }) => {
  const total = valueA + valueB || 1;
  const pctA = (valueA / total) * 100;
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>{valueA}</span>
        <span className="text-gray-500">{label}</span>
        <span>{valueB}</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden flex">
        <div className="h-full bg-emerald-500" style={{ width: `${pctA}%` }} />
        <div className="h-full bg-blue-500 flex-1" />
      </div>
    </div>
  );
};

const Stats = ({ matches }) => {
  const match = matches.find((m) => m.status === "live") || matches.find((m) => m.status === "completed");

  if (!match) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Statistik Perbandingan</h2>
        <p className="text-center text-gray-500">Tidak ada statistik untuk ditampilkan</p>
      </section>
    );
  }

  return (
    <section className="py-12 pb-24">
      <h2 className="text-3xl font-bold text-center mb-2 text-white">Statistik Perbandingan</h2>
      <p className="text-center text-gray-500 mb-8">
        {match.teamA} vs {match.teamB}
      </p>
      <div className="max-w-2xl mx-auto">
        {Object.entries(match.stats).map(([key, [a, b]]) => (
          <StatBar key={key} label={key} valueA={a} valueB={b} />
        ))}
      </div>
    </section>
  );
};

export default Stats;
