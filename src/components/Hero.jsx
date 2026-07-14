import { Link } from "react-router-dom";
import { sportsData } from "../data/sportsData";

const Hero = ({ category, onCategoryChange }) => {
  const current = sportsData[category];

  return (
    <section
      className="relative overflow-hidden py-24 px-6 text-center border-b border-white/10"
      style={{
        background: `radial-gradient(circle at 50% 0%, ${current.accent}22, transparent 60%), #0a0a0a`,
      }}
    >
      <p className="uppercase tracking-[0.3em] text-xs text-gray-400 mb-4">
        Indorama Sports Championship 2026
      </p>
      <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4">
        <span style={{ color: current.accent }}>{current.icon}</span>{" "}
        {current.label} Live
      </h1>
      <p className="text-gray-400 max-w-xl mx-auto mb-8">
        Jadwal, hasil, susunan pemain, dan statistik pertandingan — semua
        dalam satu tempat.
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          to="/jadwal"
          className="px-6 py-3 rounded-lg font-medium text-black"
          style={{ backgroundColor: current.accent }}
        >
          Lihat Jadwal
        </Link>
        <Link
          to="/live"
          className="px-6 py-3 rounded-lg font-medium border border-white/20 text-white hover:bg-white/10 transition-colors"
        >
          Tonton Live
        </Link>
      </div>
    </section>
  );
};

export default Hero;
