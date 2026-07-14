const Results = ({ matches }) => {
  const liveMatches = matches.filter((m) => m.status === "live");
  const completedMatches = matches.filter((m) => m.status === "completed");

  if (liveMatches.length === 0 && completedMatches.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Hasil Pertandingan</h2>
        <p className="text-center text-gray-500">Belum ada hasil untuk kategori ini</p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Hasil Pertandingan</h2>
      <div className="space-y-4 max-w-3xl mx-auto">
        {[...liveMatches, ...completedMatches].map((match) => (
          <div
            key={match.id}
            className="flex items-center justify-between px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white truncate">
                {match.teamA} vs {match.teamB}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {match.date} • {match.venue}
              </p>
            </div>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              {match.status === "live" && <span className="text-emerald-400 text-sm">●</span>}
              {match.score.teamA} - {match.score.teamB}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Results;
