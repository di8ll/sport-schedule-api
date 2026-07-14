import { NavLink } from "react-router-dom";
import { sportsData } from "../data/sportsData";

const navItems = [
  { to: "/", label: "Beranda", end: true },
  { to: "/jadwal", label: "Jadwal" },
  { to: "/hasil", label: "Hasil" },
  { to: "/live", label: "Live Streaming" },
  { to: "/lineup", label: "Line-up" },
  { to: "/statistik", label: "Statistik" },
];

const Navbar = ({ selectedCategory, onCategoryChange }) => {
  const current = sportsData[selectedCategory];

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <span className="font-bold text-white text-sm sm:text-base whitespace-nowrap">
          {current.icon} Indorama Sports
        </span>

        <nav className="flex flex-wrap gap-1 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? "bg-white/10 text-white font-medium"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-gray-800 text-white text-sm rounded-md px-2 py-1.5 border border-gray-700"
        >
          {Object.entries(sportsData).map(([key, data]) => (
            <option key={key} value={key}>
              {data.icon} {data.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Navbar;
