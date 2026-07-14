const TeamLineup = ({ teamName, players }) => (
  <div className="space-y-2">
    <div className="px-4 py-2 bg-gray-900/50 rounded-lg font-semibold text-white">
      {teamName}
    </div>
    {players.length === 0 ? (
      <p className="text-sm text-gray-500 px-4">Susunan pemain belum diumumkan</p>
    ) : (
      players.map((p, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50"
        >
          <div className="w-9 h-9 flex items-center justify-center bg-gray-900/50 rounded-full text-white font-bold text-sm">
            {p.number}
          </div>
          <div>
            <p className="text-white font-medium">{p.name}</p>
            <p className="text-xs text-gray-400">{p.position}</p>
          </div>
        </div>
      ))
    )}
  </div>
);

const Lineup = ({ matches }) => {
  const match = matches.find((m) => m.status === "live") || matches.find((m) => m.status === "upcoming");

  if (!match) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Starting Line-up</h2>
        <p className="text-center text-gray-500">Tidak ada pertandingan untuk ditampilkan</p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Starting Line-up</h2>
      <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <TeamLineup teamName={match.teamA} players={match.lineupA} />
        <TeamLineup teamName={match.teamB} players={match.lineupB} />
      </div>
    </section>
  );
};

export default Lineup;
