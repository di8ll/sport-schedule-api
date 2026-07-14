const statusBadge = (status) => {
  switch (status) {
    case "live":
      return { text: "Sedang Berlangsung", color: "text-emerald-400 bg-emerald-900/20" };
    case "upcoming":
      return { text: "Akan Datang", color: "text-blue-400 bg-blue-900/20" };
    case "completed":
      return { text: "Selesai", color: "text-gray-400 bg-gray-900/20" };
    default:
      return { text: status, color: "text-gray-400 bg-gray-900/20" };
  }
};

const MatchRow = ({ match }) => {
  const { text, color } = statusBadge(match.status);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-700/30 transition-colors">
      <div className="min-w-0">
        <h3 className="font-semibold text-white truncate">
          {match.teamA} vs {match.teamB}
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          {match.date} • {match.time} • {match.venue}
        </p>
      </div>
      <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        {text}
      </span>
    </div>
  );
};

const Schedule = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Jadwal Pertandingan</h2>
        <p className="text-center text-gray-500">Belum ada jadwal untuk kategori ini</p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Jadwal Pertandingan</h2>
      <div className="space-y-4 max-w-3xl mx-auto">
        {matches.map((match) => (
          <MatchRow key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
};

export default Schedule;
