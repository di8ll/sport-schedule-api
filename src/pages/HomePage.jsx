import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ============= INDORAMA BRAND TOKENS =============
const EVENT_DATE = new Date("2026-07-17T00:00:00");

function getTimeLeft() {
  const diff = EVENT_DATE.getTime() - new Date().getTime();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const HomePage = () => {
  const navigate = useNavigate();
  const [activeGroup, setActiveGroup] = useState("internal");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [isStandingsOpen, setIsStandingsOpen] = useState(false);
  const [standingsData, setStandingsData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStandings = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/standings");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setStandingsData(data);
        setIsStandingsOpen(true);
      }
    } catch (error) {
      console.error("Gagal mengambil data klasemen:", error);
      alert("Gagal mengambil data.");
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
      {/* TOMBOL KLASEMEN */}
      <button
        onClick={fetchStandings}
        className="fixed top-4 right-4 z-50 bg-[#00308F] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-[#ED1C24] transition-all"
      >
        Klasemen
      </button>

      {/* LOGO INDORAMA */}
      <div className="fixed top-[-30px] sm:top-[-40px] left-0 sm:left-2 z-50 pointer-events-none">
        <img src="/logo_ifd.png" alt="Indorama" className="w-28 sm:w-40 drop-shadow-md pointer-events-auto block" />
      </div>

      {/* MODAL KLASEMEN (tetap dipertahankan) */}
      {isStandingsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Isi modal disingkat agar ringkas */}
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h2 className="font-black text-[#00308F] uppercase">Klasemen Sementara</h2>
              <button onClick={() => setIsStandingsOpen(false)} className="text-xl font-bold text-slate-400">✕</button>
            </div>
            <div className="overflow-auto p-4">
               {/* Tabel data tetap sama seperti sebelumnya */}
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <div
        className="relative w-full min-h-[100svh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.55), rgba(248, 250, 252, 1)), url('/stadium-banner.jpg')` }}
      >
        {/* Konten Hero tetap sama */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-[#00308F] mb-2 uppercase italic leading-tight mt-20">
          Indorama <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-[#00308F] to-[#ED1C24]">Founder's Day</span>
        </h1>
        <p className="text-4xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-wide text-[#ED1C24] mb-8">2026</p>
        
        {/* Tombol Kategori dan Countdown */}
        {/* ... (isi hero section lainnya sesuai kode Anda) ... */}
      </div>

      {/* FOOTER */}
      <footer className="w-full text-center py-5 border-t-2 border-slate-200 bg-white">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© {new Date().getFullYear()} Indorama</p>
      </footer>
    </div>
  );
};

export default HomePage;