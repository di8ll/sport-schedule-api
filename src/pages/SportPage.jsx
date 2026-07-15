import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { sportTheme } from "../data/sportsData";
import api from "../services/api";

const SportPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

const [activeTab, setActiveTab] = useState(() => {
  return localStorage.getItem(`activeTab_${category}`) || "jadwal";
});
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  // State untuk melacak halaman item saat ini
  const [currentPage, setCurrentPage] = useState(0);

  // Fungsi Helper untuk memetakan KODE CLUB dari database ke NAMA FILE LOGO di public/logos/
  const getLogoFileName = (teamCode) => {
    if (!teamCode) return "default-club.png";

    const code = teamCode.toUpperCase().trim();

    // Pemetaan singkatan / kode tim ke nama file gambar asli Anda
    switch (code) {
      case "HO":
        return "ho.png";
      case "IPCI":
        return "ipci.png";
      case "IRT":
        return "irt.png";
      case "SPG": // Jika dari DB teksnya SPG, arahkan ke file spinning.png
      case "SPINNING":
        return "spinning.png";
      case "WVG": // Jika dari DB teksnya WVG, arahkan ke file weaving.png
      case "WEAVING":
        return "weaving.png";
      case "POLY":
      case "POLYESTER":
        return "polyester.png";
      default:
        // Fallback jika nama tim sudah pas dengan nama file lowercased
        return `${code.toLowerCase().replace(/\s+/g, "")}.png`;
    }
  };

  // Fungsi bantu: bersihkan string jadi format polos (lowercase, tanpa spasi/underscore/hyphen)
  // supaya "Tenis Meja", "tenis_meja", "tenis-meja", "TENIS MEJA" semua dianggap SAMA
  const normalize = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[_\-\s]+/g, ""); // hapus semua underscore, hyphen, dan spasi
  };

  const loadMatch = async () => {
    try {
      let baseCategory = category
        ? category.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        : "";

      const normalizedCategory = normalize(baseCategory);

      // Selalu ambil semua data, jangan filter sport_type di backend
      const res = await api.get(`/matches`, { params: {} });

      if (res.data && res.data.length > 0) {
        const rawData = res.data.map((m) => ({
          id: m.id,
          date: m.match_date,
          time: m.match_time,
          stage: m.stage || "Babak Penyisihan",
          sportType: m.sport_type,
          teamA: m.club_a?.code ?? m.club_a?.name ?? "Unknown Team",
          teamB: m.club_b?.code ?? m.club_b?.name ?? "Unknown Team",
          scoreA: m.score_a ?? 0,
          scoreB: m.score_b ?? 0,
          venue: m.venue,
          status: m.status,
        }));

        const finalData = rawData.filter((m) =>
          normalize(m.sportType).includes(normalizedCategory)
        );

        setMatches(finalData);
        return;
      }
      setMatches([]);
    } catch (err) {
      console.warn("Gagal mengambil data dari API:", err.message);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadMatch();
    const interval = setInterval(() => {
      loadMatch();
    }, 5000);
    return () => clearInterval(interval);
  }, [category]);

  // Reset page pagination ketika user mengubah tab menu atas
// 1. Simpan Tab ke LocalStorage saat tab atau kategori berubah
    useEffect(() => {
      localStorage.setItem(`activeTab_${category}`, activeTab);
    }, [activeTab, category]);

    // 2. Reset Pagination saat kategori berubah (Penting!)
    useEffect(() => {
      setCurrentPage(0);
    }, [category]);

    // 3. Reset Pagination saat Tab berubah (sudah ada di kode Anda sebelumnya)
    useEffect(() => {
      setCurrentPage(0);
    }, [activeTab]);
  // Fallback theme jika category tidak terdaftar di sportsData
  const theme = sportTheme[category] || sportTheme.futsal;

  // 1. Filter data match berdasarkan kategori Tab aktif
  const filteredMatches = matches.filter((m) => {
    const status = m.status?.toUpperCase().trim();
    if (activeTab === "hasil") return status === "FINISHED";
    if (activeTab === "live") return status === "LIVE";
    if (activeTab === "jadwal") return status === "UPCOMING";
    return true;
  });
  // 2. Tentukan batasan item per halaman (Maksimal 3 item)
  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE);

  // 3. Ambil data match yang masuk ke halaman aktif saat ini (Slice array)
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentMatchesToShow = filteredMatches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // 4. Ambil tanggal dari pertandingan pertama di halaman ini untuk dinonjolkan di Header
  const activeDate = currentMatchesToShow.length > 0 ? currentMatchesToShow[0].date : "";

  const liveCount = matches.filter((m) => m.status === "LIVE").length;

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-xl font-bold text-slate-700">Memuat Pertandingan...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col justify-between antialiased selection:bg-teal-500/20">
      <div>
        {/* ================= 1. HERO BANNER ================= */}
        <div
          className="relative h-64 sm:h-64 md:h-72 w-full flex items-center p-4 sm:p-8 md:p-12 text-white bg-cover transition-all duration-500"
          style={
            theme.banner
              ? {
                backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.35)), url('${theme.banner}')`,
                backgroundPosition: theme.bgPos || "center 25%",
              }
              : {
                background: `linear-gradient(135deg, ${theme.color} 0%, ${theme.color}CC 60%, #0F172A 100%)`,
              }
          }
        >
          <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-6 sm:right-6 flex items-center gap-2 sm:gap-4 z-10 w-full max-w-7xl mx-auto">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-[10px] sm:text-xs font-medium bg-white/10 hover:bg-white/20 px-2 py-1 sm:px-3 sm:py-1.5 backdrop-blur rounded-md border border-white/20 transition-all shrink-0"
            >
              Kembali ← Portal Utama
            </button>
            <h3 className="text-[11px] sm:text-sm md:text-base font-semibold tracking-wide text-white/90 drop-shadow-sm truncate">
              Indorama Founder's Day 2026
            </h3>
          </div>

          <div className="z-10 w-full sm:w-auto sm:ml-auto sm:mr-4 md:mr-12 flex flex-col items-center text-center mt-12 sm:mt-6 px-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="text-2xl sm:text-6xl font-black tracking-tight uppercase italic leading-none drop-shadow-md">
                {theme.name}
              </h2>
              <span className="text-xl sm:text-5xl drop-shadow-md">{theme.icon}</span>
            </div>
            <p className="text-[10px] sm:text-sm font-medium tracking-wide text-white/90 mt-1.5 drop-shadow-sm">
              {theme.isExternal ? "Turnamen Antar Sekolah" : "Turnamen Antar Divisi"}
            </p>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur px-3 sm:px-4 py-1 rounded-full border border-white/10 mt-2 sm:mt-2.5 shadow-sm">
              {theme.type || "TEAM SPORT"}
            </span>
          </div>
        </div>

        {/* ================= 2. MENU TABS ================= */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/95">
          <div className="max-w-7xl mx-auto flex justify-start sm:justify-center gap-3 sm:gap-8 px-3 sm:px-4 overflow-x-auto scrollbar-none">
            {[
              { id: "jadwal", label: "Akan Datang" },
              { id: "live", label: "Berlangsung" },
              { id: "hasil", label: "Hasil Pertandingan" },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-2 sm:px-3 text-[11px] sm:text-sm font-bold transition-all uppercase tracking-wider relative shrink-0 whitespace-nowrap border-b-2 -mb-[2px] flex items-center gap-1.5 ${isSelected
                      ? "text-[#008080] border-[#008080]"
                      : "text-slate-400 border-transparent hover:text-slate-600"
                    }`}
                >
                  {tab.label}
                  {tab.id === "live" && liveCount > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none ${isSelected ? "bg-red-500 text-white animate-pulse" : "bg-red-100 text-red-600"
                        }`}
                    >
                      {liveCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= 3. DYNAMIC CONTENT & PAGINATION ================= */}
        <div className="max-w-7xl mx-auto p-3 sm:p-6 md:p-8 mt-3 sm:mt-4">
          {filteredMatches.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Header Tanggal Aktif */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <span className="text-lg sm:text-xl">📅</span>
                  <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-800 tracking-wide uppercase">
                    Jadwal Pertandingan : 
                  </h3>
                </div>
                <span className="text-[11px] sm:text-xs font-bold px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full w-fit">
                  Menampilkan {currentMatchesToShow.length} Pertandingan
                </span>
              </div>

              {/* Grid Responsive (Maksimal 3 Card per Halaman) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentMatchesToShow.map((match) => {
                  const isLive = match.status === "LIVE";
                  const isUpcoming = match.status === "UPCOMING";
                  const isFinished = match.status === "FINISHED";

                  let cardBorderStyle = "";
                  let headerStyle = "";
                  let badgeTimeStyle = "";

                  if (isLive) {
                    cardBorderStyle =
                      "border-2 border-red-500 shadow-[0_4px_20px_rgba(237,28,36,0.15)] animate-[pulse_3s_infinite]";
                    headerStyle = "bg-red-50/70 border-red-200";
                    badgeTimeStyle = "bg-red-100 border-red-200 text-red-700";
                  } else if (isUpcoming) {
                    cardBorderStyle = "border-2 border-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.06)]";
                    headerStyle = "bg-slate-100 border-slate-900/10";
                    badgeTimeStyle = "bg-slate-900 text-white border-slate-950";
                  } else if (isFinished) {
                    cardBorderStyle = "border-2 border-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.06)]";
                    headerStyle = "bg-blue-50/60 border-blue-100";
                    badgeTimeStyle = "bg-blue-100 border-blue-200 text-blue-700";
                  }

                  return (
                    <div
                      key={match.id}
                      // onClick={() => setSelectedMatchId(match.id)}
                      className={`bg-white rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer ${cardBorderStyle}`}
                    >
                      {/* Top Header Card */}
                    <div className={`flex items-center justify-between gap-2 px-3 sm:px-5 py-2.5 sm:py-3 border-b-2 ${headerStyle}`}>
                      <div className="flex flex-col gap-0.5"> {/* Ubah menjadi column agar tanggal dan jam sejajar */}
                        
                        {/* TAMBAHKAN BARIS INI UNTUK TANGGAL */}
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          📅 {match.date}
                        </span>

                        <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 min-w-0">
                          <span className={`text-[11px] sm:text-xs font-bold font-mono px-1.5 sm:px-2 py-0.5 rounded border shrink-0 ${badgeTimeStyle}`}>
                            {match.time}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-bold tracking-wide truncate">
                            📍 {match.venue || "Lapangan GOR PWS"}
                          </span>
                        </div>
                      </div>
                        <div className="shrink-0">
                          {isLive ? (
                            <span className="inline-flex items-center gap-1 bg-red-600 text-white font-extrabold text-[9px] sm:text-[10px] tracking-widest px-2 sm:px-2.5 py-0.5 rounded-full uppercase border border-red-700 shadow-sm whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              LIVE
                            </span>
                          ) : isFinished ? (
                            <span className="bg-blue-600 text-white font-extrabold text-[9px] sm:text-[10px] tracking-widest px-2 sm:px-2.5 py-0.5 rounded-full uppercase border border-blue-700 whitespace-nowrap">
                              FINISHED
                            </span>
                          ) : (
                            <span className="bg-slate-200 text-slate-800 font-extrabold text-[9px] sm:text-[10px] tracking-widest px-2 sm:px-2.5 py-0.5 rounded-full uppercase border border-slate-300 whitespace-nowrap">
                              UPCOMING
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Main Match Info */}
                      <div className="p-3 sm:p-4 md:p-5 flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50/50">
                        {/* Container Flex Row untuk menyejajarkan Babak & Kategori Gender */}
                        <div className="flex items-center justify-center gap-1.5 mb-3 sm:mb-4 flex-wrap">
                          <span className="text-[9px] sm:text-[10px] font-extrabold text-[#008080] tracking-widest uppercase bg-teal-50/60 px-2.5 sm:px-3 py-1 rounded-full border-2 border-teal-200/80 text-center">
                            {match.stage}
                          </span>

                          {/* Badge Klasifikasi Putra / Putri Berdasarkan String sportType dari DB */}
                          {match.sportType && (match.sportType.toLowerCase().includes("putra") || match.sportType.toLowerCase().includes("putri")) && (
                            <span className={`text-[9px] sm:text-[10px] font-extrabold tracking-widest uppercase px-2.5 sm:px-3 py-1 rounded-full border-2 text-center ${match.sportType.toLowerCase().includes("putri")
                                ? "bg-pink-50 border-pink-200 text-pink-700"
                                : "bg-blue-50 border-blue-200 text-blue-700"
                              }`}>
                              {match.sportType.toLowerCase().includes("putri") ? "👩 Putri" : "👨 Putra"}
                            </span>
                          )}
                        </div>

                        <div className="w-full flex items-center justify-between gap-1 sm:gap-1.5">
                          {/* Team A */}
                          <div className="w-[38%] flex flex-col items-center text-center">
                            <div className="w-12 h-12 sm:w-20 sm:h-20 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center mb-1.5 sm:mb-2 shadow-sm overflow-hidden shrink-0">
                              <img
                                src={`/logos/${getLogoFileName(match.teamA)}`}
                                alt={match.teamA}
                                className="w-full h-full object-contain p-1 sm:p-1.5"
                                onError={(e) => { e.currentTarget.src = '/logos/default-club.png'; }}
                              />
                            </div>
                            <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs tracking-wide uppercase line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center">
                              {match.teamA}
                            </span>
                          </div>

                          {/* VS / Score */}
                          <div className="w-[24%] flex flex-col items-center justify-center">
                            {isUpcoming ? (
                              <div className="font-black italic text-[10px] sm:text-xs tracking-wider text-slate-500 bg-slate-100 border-2 border-slate-300 px-1.5 sm:px-2.5 py-1 rounded-xl shadow-sm">
                                VS
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                                <span
                                  className={`text-sm sm:text-2xl font-mono font-black px-1 sm:px-2 py-0.5 rounded-xl border-2 ${isLive ? "bg-red-50 border-red-500 text-red-600" : "bg-blue-50 border-blue-500 text-blue-600"
                                    }`}
                                >
                                  {match.scoreA}
                                </span>
                                <span className="text-slate-400 font-bold text-xs sm:text-lg">:</span>
                                <span
                                  className={`text-sm sm:text-2xl font-mono font-black px-1 sm:px-2 py-0.5 rounded-xl border-2 ${isLive ? "bg-red-50 border-red-500 text-red-600" : "bg-blue-50 border-blue-500 text-blue-600"
                                    }`}
                                >
                                  {match.scoreB}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Team B */}
                          <div className="w-[38%] flex flex-col items-center text-center">
                            <div className="w-12 h-12 sm:w-20 sm:h-20 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center mb-1.5 sm:mb-2 shadow-sm overflow-hidden shrink-0">
                              <img
                                src={`/logos/${getLogoFileName(match.teamB)}`}
                                alt={match.teamB}
                                className="w-full h-full object-contain p-1 sm:p-1.5"
                                onError={(e) => { e.currentTarget.src = '/logos/default-club.png'; }}
                              />
                            </div>
                            <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs tracking-wide uppercase line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center">
                              {match.teamB}
                            </span>
                          </div>
                        </div>

                        {/* <div className="w-full text-center mt-2 sm:mt-3 pt-2 border-t border-slate-100 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Klik untuk Detail Pertandingan 📋
                        </div> */}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ================= BAR PAGINATION ================= */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-200">
                  <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Halaman <span className="text-slate-700">{currentPage + 1}</span> Dari {totalPages} Halaman
                  </p>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                      disabled={currentPage === 0}
                      className="flex-1 sm:flex-initial text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 bg-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 text-slate-700 border-slate-300"
                    >
                      ← Sebelumnya
                    </button>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                      disabled={currentPage === totalPages - 1}
                      className="flex-1 sm:flex-initial text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 bg-teal-700 border-teal-800 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-800 active:scale-95 shadow-sm"
                    >
                      Berikutnya →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ================= STATE KOSONG ================= */
            <div className="text-center py-12 sm:py-20 px-4 bg-white border-2 border-dashed border-slate-300 rounded-2xl shadow-sm max-w-md mx-auto">
              <span className="text-4xl sm:text-5xl block mb-3 animate-[bounce_2s_infinite]">
                {activeTab === "live" ? "🎥" : activeTab === "jadwal" ? "⏳" : "🏁"}
              </span>
              <p className="text-slate-500 text-xs sm:text-sm font-bold tracking-wide">
                {activeTab === "live"
                  ? "Tidak ada pertandingan live saat ini."
                  : activeTab === "jadwal"
                    ? "Jadwal pertandingan mendatang belum tersedia."
                    : "Belum ada riwayat hasil pertandingan."}
              </p>
              <p className="text-slate-400 text-[11px] mt-1">Coba lihat menu tab lainnya untuk info terbaru.</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= 4. DETAILED MODAL OVERLAY ================= */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
            {/* Header Modal */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 gap-2">
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-teal-400 truncate">
                  {selectedMatch.stage} • INDORAMA PORTAL
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-medium mt-0.5 truncate">
                  📍 {selectedMatch.venue}
                </span>
              </div>
              <button
                onClick={() => setSelectedMatchId(null)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-sm transition-all shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Konten Modal */}
            <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-5 p-4 sm:p-5">
              {/* Papan Skor Utama */}
              <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-100 gap-1">
                <div className="w-[35%] flex flex-col items-center text-center">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-1 shadow-sm overflow-hidden">
                    <img
                      src={`/logos/${getLogoFileName(selectedMatch.teamA)}`}
                      alt={selectedMatch.teamA}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => { e.currentTarget.src = '/logos/default-club.png'; }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-slate-700">{selectedMatch.teamA}</span>
                </div>

                <div className="w-[30%] flex flex-col items-center">
                  {selectedMatch.status === "UPCOMING" ? (
                    <span className="text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full uppercase tracking-wider whitespace-nowrap">
                      {selectedMatch.time}
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-lg sm:text-2xl font-mono font-black text-slate-900">{selectedMatch.scoreA}</span>
                      <span className="text-slate-400 font-bold text-sm sm:text-lg">:</span>
                      <span className="text-lg sm:text-2xl font-mono font-black text-slate-900">{selectedMatch.scoreB}</span>
                    </div>
                  )}
                  <span
                    className={`text-[8px] sm:text-[9px] font-extrabold tracking-widest mt-1 px-1.5 sm:px-2 py-0.5 rounded-full uppercase whitespace-nowrap ${selectedMatch.status === "LIVE" ? "bg-red-100 text-red-600 animate-pulse" : "bg-blue-100 text-blue-600"
                      }`}
                  >
                    {selectedMatch.status === "LIVE" ? "🔴 Live Match" : selectedMatch.status === "FINISHED" ? "🏁 Finished" : "⏳ Upcoming"}
                  </span>
                </div>

                <div className="w-[35%] flex flex-col items-center text-center">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-1 shadow-sm overflow-hidden">
                    <img
                      src={`/logos/${getLogoFileName(selectedMatch.teamB)}`}
                      alt={selectedMatch.teamB}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => { e.currentTarget.src = '/logos/default-club.png'; }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-slate-700">{selectedMatch.teamB}</span>
                </div>
              </div>

              {/* Info tambahan sederhana */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-xs">
                {/* Menampilkan Detail Kategori Gender di dalam Modal Box */}
                {selectedMatch.sportType && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase tracking-wide">Kategori</span>
                    <span className={`font-bold ${selectedMatch.sportType.toLowerCase().includes("putri") ? "text-pink-600" : "text-blue-600"}`}>
                      {selectedMatch.sportType}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wide">Tanggal</span>
                  <span className="font-bold text-slate-700">{selectedMatch.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wide">Jam</span>
                  <span className="font-bold text-slate-700">{selectedMatch.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wide">Venue</span>
                  <span className="font-bold text-slate-700">{selectedMatch.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wide">Babak</span>
                  <span className="font-bold text-slate-700">{selectedMatch.stage}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportPage;