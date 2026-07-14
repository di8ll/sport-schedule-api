const LiveStream = ({ matches }) => {
  const liveMatch = matches.find((m) => m.status === "live" && m.youtubeId);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Live Streaming</h2>
      {liveMatch ? (
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-gray-300 mb-4">
            {liveMatch.teamA} vs {liveMatch.teamB}
          </p>
          <div className="aspect-video rounded-xl overflow-hidden border border-gray-700">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${liveMatch.youtubeId}`}
              title="Live stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Tidak ada siaran langsung saat ini</p>
      )}
    </section>
  );
};

export default LiveStream;
