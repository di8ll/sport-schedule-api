import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ============= INDORAMA BRAND TOKENS =============
const EVENT_DATE_INTERNAL = new Date("2026-07-17T00:00:00");
const EVENT_DATE_EXTERNAL = new Date("2026-08-01T00:00:00");

// Mapping kode klub (dari API) -> nama file logo di /public/logos
// PENTING: sesuaikan key di sini dengan kode klub ASLI dari API kamu.
// Tambah/ubah baris ini kalau ada kode yang belum cocok.
const CLUB_LOGO_MAP = {
  HO: "ho",
  IPCI: "ipci",
  IRT: "irt",
  PYT: "polyester",
  SPG: "spinning",
  WVG: "weaving",
};

function getClubLogoSrc(clubCode) {
  const key = (clubCode || "").toUpperCase();
  const filename = CLUB_LOGO_MAP[key] || clubCode?.toLowerCase();
  return `/logos/${filename}.png`;
}

function getTimeLeft(targetDate) {
  const diff = targetDate.getTime() - new Date().getTime();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// ============= TIMELINE DATA =============
const timelineEvents = [
  {
    id: 1,
    start: new Date("2026-07-01T00:00:00"),
    end: new Date("2026-07-04T23:59:59"),
    label: "01 – 04 Jul 2026",
    title: "Pendaftaran Dibuka",
    desc: "Setiap unit kerja mendaftarkan tim untuk seluruh cabang olahraga internal & eksternal.",
    icon: "📝",
  },
  {
    id: 2,
    start: new Date("2026-07-05T00:00:00"),
    end: new Date("2026-07-05T23:59:59"),
    label: "05 Jul 2026",
    title: "Technical Meeting",
    desc: "Pertemuan teknis membahas peraturan, format pertandingan, dan penyusunan jadwal.",
    icon: "🤝",
  },
  {
    id: 3,
    start: new Date("2026-07-06T00:00:00"),
    end: new Date("2026-07-14T23:59:59"),
    label: "06 – 14 Jul 2026",
    title: "Babak Penyisihan",
    desc: "Pertandingan seru di seluruh cabang olahraga memperebutkan tiket ke babak berikutnya.",
    icon: "🏆",
  },
  {
    id: 4,
    start: new Date("2026-07-15T00:00:00"),
    end: new Date("2026-07-16T23:59:59"),
    label: "15 – 16 Jul 2026",
    title: "Semifinal",
    desc: "Tim-tim terbaik bertarung habis-habisan demi satu tempat di partai puncak.",
    icon: "🔥",
  },
  {
    id: 5,
    start: new Date("2026-07-17T00:00:00"),
    end: new Date("2026-07-17T23:59:59"),
    label: "17 Jul 2026",
    title: "Grand Final & Closing Ceremony",
    desc: "Puncak perayaan Indorama Founder's Day: partai final, pengumuman juara umum, dan penghargaan.",
    icon: "🎉",
  },
];

function getStatus(event) {
  const now = new Date();
  if (now < event.start) return "upcoming";
  if (now > event.end) return "done";
  return "active";
}

// Reveal-on-scroll hook for the timeline cards
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

function Dot({ status, className = "" }) {
  const color =
    status === "done"
      ? "bg-[#00308F]"
      : status === "active"
      ? "bg-[#ED1C24]"
      : "bg-white border-2 border-[#DCDAD5]";
  return (
    <span
      className={`relative flex items-center justify-center w-4 h-4 rounded-full shadow-md ${color} ${className}`}
    >
      {status === "active" && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#ED1C24] opacity-75 animate-ping" />
      )}
    </span>
  );
}

function TimelineCard({ event, status, align }) {
  const isDone = status === "done";
  const isActive = status === "active";
  return (
    <div
      className={`group relative w-full max-w-sm p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isActive
          ? "bg-white border-[#ED1C24]/40 shadow-md shadow-[#ED1C24]/10"
          : isDone
          ? "bg-white/70 border-slate-200"
          : "bg-slate-50 border-slate-200"
      } ${align === "right" ? "sm:text-right" : ""}`}
    >
      {isActive && (
        <span
          className={`absolute -top-2.5 ${
            align === "right" ? "right-4" : "left-4"
          } text-[8px] font-black uppercase tracking-widest bg-[#ED1C24] text-white px-2 py-0.5 rounded-full shadow`}
        >
          Sedang Berlangsung
        </span>
      )}
      <div
        className={`flex items-center gap-2 mb-1 ${
          align === "right" ? "sm:flex-row-reverse" : ""
        }`}
      >
        <span className="text-xl leading-none">{event.icon}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#8B8D8E]">
          {event.label}
        </span>
      </div>
      <h3
        className={`text-sm sm:text-base font-black uppercase italic tracking-tight mb-1 ${
          isDone ? "text-[#00308F]/60" : "text-[#00308F]"
        }`}
      >
        {event.title}
      </h3>
      <p className="text-[11px] sm:text-xs font-medium text-slate-500 leading-relaxed">
        {event.desc}
      </p>
    </div>
  );
}

function TimelineItem({ event, index }) {
  const [ref, visible] = useReveal();
  const isLeft = index % 2 === 0;
  const status = getStatus(event);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      {/* Mobile layout: single rail on the left */}
      <div className="sm:hidden relative pl-10">
        <Dot status={status} className="absolute left-[8px] top-1.5 -translate-x-1/2" />
        <TimelineCard event={event} status={status} />
      </div>

      {/* Desktop layout: alternating left / right around a center rail */}
      <div className="hidden sm:grid grid-cols-[1fr_44px_1fr] items-start">
        <div className={isLeft ? "pr-10 flex justify-end" : ""}>
          {isLeft && <TimelineCard event={event} status={status} align="right" />}
        </div>
        <div className="flex justify-center pt-1.5">
          <Dot status={status} />
        </div>
        <div className={!isLeft ? "pl-10 flex justify-start" : ""}>
          {!isLeft && <TimelineCard event={event} status={status} align="left" />}
        </div>
      </div>
    </div>
  );
}

function TimelineSection() {
  return (
    <section className="w-full py-16 sm:py-24 relative bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-[#ED1C24] mb-3">
            Timeline
          </span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase italic text-[#00308F] tracking-tight">
            Rangkaian Menuju <span className="text-[#ED1C24]">Hari-H</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm font-semibold text-[#8B8D8E] max-w-md mx-auto">
            Ikuti setiap tahapan Indorama Founder&apos;s Day 2026, dari pendaftaran
            hingga perayaan puncak.
          </p>
        </div>

        <div className="relative">
          {/* connecting rail - mobile */}
          <div className="sm:hidden absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#00308F] via-[#DCDAD5] to-[#ED1C24] rounded-full" />
          {/* connecting rail - desktop */}
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#00308F] via-[#DCDAD5] to-[#ED1C24] rounded-full" />

          <div className="flex flex-col gap-8 sm:gap-10">
            {timelineEvents.map((event, index) => (
              <TimelineItem key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const HomePage = () => {
  const navigate = useNavigate();
  const [activeGroup, setActiveGroup] = useState("internal");

  // Tanggal target countdown mengikuti grup yang aktif
  const eventTarget =
    activeGroup === "internal" ? EVENT_DATE_INTERNAL : EVENT_DATE_EXTERNAL;
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(eventTarget));

  // State untuk Klasemen
  const [isStandingsOpen, setIsStandingsOpen] = useState(false);
  const [standingsData, setStandingsData] = useState([]);

  useEffect(() => {
    // Hitung ulang segera saat grup berganti (internal <-> external)
    setTimeLeft(getTimeLeft(eventTarget));

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(eventTarget));
    }, 1000);
    return () => clearInterval(interval);
  }, [eventTarget]);

  const fetchStandings = async () => {
    try {
      console.log("Mencoba mengambil data dari API...");
      const response = await fetch("https://api.indoramafoundersday.com/api/standings");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data diterima:", data); // Cek konsol browser (F12)

      // Pastikan data adalah array sebelum diset ke state
      if (Array.isArray(data)) {
        setStandingsData(data);
        setIsStandingsOpen(true);
      } else {
        console.error("Format data bukan array:", data);
      }
    } catch (error) {
      console.error("Gagal mengambil data klasemen:", error);
      alert("Gagal mengambil data. Pastikan API berjalan dan CORS diaktifkan.");
    }
  };
  const categoryGroups = {
    internal: [
      { id: "futsal", label: "Futsal", icon: "⚽" },
      { id: "volley", label: "Volley", icon: "🏐" },
      { id: "catur", label: "Catur", icon: "♟️" },
      { id: "badminton", label: "Badminton", icon: "🏸" },
      { id: "tenismeja", label: "Tenis Meja", icon: "🏓" },
      { id: "padel", label: "Padel", icon: "🎾" },
    ],
    external: [
      { id: "volly", label: "Volly", icon: "🏐" },
      { id: "basket", label: "Basket", icon: "🏀" },
    ],
  };

  const handleGroupChange = (group) => setActiveGroup(group);
  const handleCategoryClick = (catId) => navigate(`/sport/${catId}`);
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="w-full min-h-screen relative bg-slate-50 text-slate-800">
      {/* TOMBOL KLASEMEN (Posisi di pojok kanan atas) */}
      <button
        onClick={fetchStandings}
        className="fixed top-4 right-4 z-50 bg-[#00308F] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-[#ED1C24] transition-all"
      >
        Klasemen
      </button>

      {/* CONTAINER LOGO */}
      <div className="fixed top-2 left-2 z-[9999] flex items-center gap-4">
        {/* LOGO INDORAMA */}
        <img
          src="/logo_ifd.png"
          alt="Indorama"
          className="w-28 sm:w-40 drop-shadow-md block"
        />
        
        {/* LOGO POHON */}
        <img
          src="/pohon.png"
          alt="Pohon"
          className="w-16 sm:w-20 drop-shadow-md block"
        />
      </div>

      {/* MODAL KLASEMEN */}
      {isStandingsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h2 className="font-black text-[#00308F] uppercase">
                Klasemen Sementara & Perolehan Poin
              </h2>
              <button
                onClick={() => setIsStandingsOpen(false)}
                className="text-xl font-bold text-slate-400"
              >
                ✕
              </button>
            </div>
            <div className="overflow-auto p-4">
              <table className="w-full text-center text-[10px] sm:text-xs">
                <thead>
                  <tr className="text-slate-500 uppercase border-b">
                    <th className="p-2">Rank</th>
                    <th className="p-2">Unit</th>
                    <th className="p-2">Futsal</th>
                    <th className="p-2">Catur</th>
                    <th className="p-2">Badminton</th>
                    <th className="p-2">Padel</th>
                    <th className="p-2">Volley (P/W)</th>
                    <th className="p-2">Tenis Meja (P/W)</th>
                    <th className="p-2 text-[#ED1C24]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {standingsData.map((item, index) => (
                    <tr key={item.id}>
                      <td className="p-2 font-bold">{index + 1}</td>
                      <td className="p-2 font-bold text-[#00308F]">
                        <div className="flex items-center justify-center gap-1.5">
                          <img
                            src={getClubLogoSrc(item.club.code)}
                            alt={item.club.code}
                            className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <span>{item.club.code}</span>
                        </div>
                      </td>
                      <td className="p-2">{item.futsal}</td>
                      <td className="p-2">{item.catur}</td>
                      <td className="p-2">{item.badminton}</td>
                      <td className="p-2">{item.padel}</td>
                      <td className="p-2">
                        {item.volley_putra} / {item.volley_putri}
                      </td>
                      <td className="p-2">
                        {item.tenis_meja_putra} / {item.tenis_meja_putri}
                      </td>
                      <td className="p-2 font-black text-[#ED1C24]">{item.total_point}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= HERO SECTION ================= */}
      <div
        className="relative w-full min-h-[100svh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.55), rgba(248, 250, 252, 1)), url('/stadium-banner.jpg')`,
        }}
      >
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#00308F]/15 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#ED1C24]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-[#00308F] mb-2 uppercase italic drop-shadow-sm leading-tight px-2 mt-20 sm:mt-24">
            Indorama{" "}
            <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-[#00308F] to-[#ED1C24]">
              Founder&apos;s Day
            </span>
          </h1>

          <p className="text-4xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-wide text-[#ED1C24] mb-8 sm:mb-10">
            2026
          </p>

          {/* Selektor Internal/External */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-1 p-1 bg-[#DCDAD5]/50 border border-[#DCDAD5] rounded-full">
              {["internal", "external"].map((group) => (
                <button
                  key={group}
                  onClick={() => handleGroupChange(group)}
                  className={`px-4 sm:px-6 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeGroup === group
                      ? "bg-[#00308F] text-white shadow-md"
                      : "text-[#8B8D8E] hover:text-[#00308F]"
                  }`}
                >
                  {group === "internal" ? "Internal" : "External"}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs font-bold text-[#8B8D8E] uppercase tracking-wider mb-3 animate-bounce">
            👇 Pilih Cabang Olahraga untuk Melihat Jadwal 👇
          </p>

          {/* BAGIAN CATEGORY SELECTION YANG DIPERBAIKI UNTUK MOBILE */}
          <div className="mb-8 sm:mb-10 w-full max-w-2xl mx-auto px-4">
            <div className="flex sm:justify-center items-center gap-3 p-2 bg-white/60 border border-slate-200/80 backdrop-blur-md rounded-2xl shadow-xl overflow-x-auto overflow-y-hidden snap-x scrollbar-none">
              {categoryGroups[activeGroup].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="shrink-0 snap-start flex flex-col items-center justify-center min-w-[75px] sm:min-w-[90px] p-3 rounded-xl transition-all duration-300 bg-white border border-slate-200 text-[#00308F] hover:bg-gradient-to-b hover:from-[#CFE1F4] hover:to-[#CFE1F4]/40 hover:border-[#00308F]/40 hover:scale-105 active:scale-95 hover:shadow-lg"
                >
                  <span className="text-2xl mb-1 drop-shadow-sm">{cat.icon}</span>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-700 whitespace-nowrap">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="w-[85vw] max-w-[260px] sm:max-w-xs mx-auto p-3 sm:p-4 rounded-xl bg-white border-2 border-[#ED1C24]/30 backdrop-blur-xl shadow-md relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[7px] sm:text-[8px] font-black uppercase tracking-widest bg-[#ED1C24] text-white px-2 sm:px-2.5 py-0.5 rounded shadow-sm whitespace-nowrap">
              Acara Mulai
            </span>
            {timeLeft ? (
              <>
                <div className="flex justify-center items-center gap-2 sm:gap-3 text-2xl sm:text-3xl font-mono font-bold text-[#00308F] pt-1">
                  <span className="w-10 text-center">{pad(timeLeft.days)}</span>
                  <span className="text-[#8B8D8E] animate-pulse">:</span>
                  <span className="w-10 text-center">{pad(timeLeft.hours)}</span>
                  <span className="text-[#8B8D8E] animate-pulse">:</span>
                  <span className="w-10 text-center text-[#ED1C24]">{pad(timeLeft.minutes)}</span>
                </div>
                <div className="grid grid-cols-3 text-[8px] sm:text-[9px] font-black text-[#8B8D8E] uppercase tracking-wider mt-1 px-1">
                  <span>Days</span>
                  <span>Hours</span>
                  <span>Minutes</span>
                </div>
              </>
            ) : (
              <p className="pt-1 pb-0.5 text-3xl sm:text-4xl font-black italic uppercase text-[#ED1C24] animate-pulse tracking-wider">
                Let&apos;s Go!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= TIMELINE SECTION ================= */}
      {/* <TimelineSection /> */}

      <footer className="w-full text-center py-5 border-t-2 border-slate-200 bg-white mt-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          © {new Date().getFullYear()} Indorama
        </p>
      </footer>
    </div>
  );
};

export default HomePage;