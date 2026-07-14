import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// 1. TEMA WARNA (Sudah diperbaiki link banner Timnas agar visual muncul)
const sportTheme = {
  timnas: {
    name: "Timnas Indonesia",
    icon: "🇮🇩",
    color: "#ED1C24", 
    secondaryColor: "#FCE8E6",
    banner: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop",
    type: "International Match"
  },
  futsal: {
    name: "Futsal Internal",
    icon: "⚽",
    color: "#00308F", // Indorama Navy
    secondaryColor: "#CFE1F4",
    banner: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1200&auto=format&fit=crop",
    type: "Corporate Sport"
  },
  volley: {
    name: "Volley Internal",
    icon: "🏐",
    color: "#ED1C24", // Indorama Red
    secondaryColor: "#FCE8E6",
    banner: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
    type: "Outdoor Sport"
  }
};

// 2. KONFIGURASI FIREBASE ASLI (Sudah tersambung ke Project indorama-sports)
const firebaseConfig = {
  apiKey: "AIzaSyAf5Uc-If7TeoFXsvbuqcrh1Nkw0aMkjJ4",
  authDomain: "indorama-sports.firebaseapp.com",
  databaseURL: "https://indorama-sports-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "indorama-sports",
  storageBucket: "indorama-sports.appspot.com",
  messagingSenderId: "391322193405",
  appId: "1:391322193405:web:2bba84866b22c4772f1d94",
  measurementId: "G-EN0RYDHJR4"
};

// Initialize Firebase jika belum diinisialisasi
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 3. KOMPONEN KECIL: CARD PERTANDINGAN
function MatchCard({ match, theme }) {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusBadge = (status) => {
    if (status === 'LIVE') {
      return (
        <span className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded animate-pulse flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span> LIVE
        </span>
      );
    }
    return <span className="bg-gray-800 text-gray-400 text-xs font-bold px-2.5 py-1 rounded">{status}</span>;
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all shadow-xl">
      <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-800/50 flex justify-between items-center text-xs text-gray-400">
        <span className="font-semibold tracking-wide truncate max-w-[70%]">{match.stage}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-gray-500">{match.time}</span>
          {getStatusBadge(match.status)}
        </div>
      </div>

      <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center justify-between w-full md:w-auto md:flex-1 gap-4">
          <div className="flex flex-1 items-center justify-end gap-3 text-right">
            <span className="font-bold text-sm md:text-lg tracking-wide">{match.teamA}</span>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center border border-red-900/30 font-black text-lg">
              {match.teamA?.charAt(0) || 'A'}
            </div>
          </div>

          <div className="bg-gray-900 px-4 py-2 rounded-xl border border-gray-800 min-w-[80px] text-center">
            <span className="font-mono text-xl md:text-2xl font-black tracking-wider text-white">
              {match.scoreA} <span className="text-gray-600 font-light">:</span> {match.scoreB}
            </span>
          </div>

          <div className="flex flex-1 items-center justify-start gap-3 text-left">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-900/20 text-yellow-500 rounded-full flex items-center justify-center border border-yellow-900/30 font-black text-lg">
              {match.teamB?.charAt(0) || 'B'}
            </div>
            <span className="font-bold text-sm md:text-lg tracking-wide">{match.teamB}</span>
          </div>
        </div>

        <div className="flex w-full md:w-auto gap-2 border-t border-gray-800/50 pt-4 md:pt-0 md:border-0">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 md:flex-none px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            ▶ {showDetails ? 'Tutup Screen' : 'Tonton & Stats'}
          </button>
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-900/20 text-[11px] text-gray-500 border-t border-gray-900/50 flex items-center gap-1">
        📍 <span className="truncate">{match.venue}</span>
      </div>

      {showDetails && (
        <div className="border-t border-gray-800 bg-gray-950 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl overflow-hidden aspect-video bg-black border border-gray-800 shadow-inner">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${match.youtubeId}?autoplay=1`}
              title="YouTube sports stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {match.stats && (
            <div className="bg-gray-900/50 border border-gray-800/80 p-4 rounded-xl flex flex-col justify-center gap-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-1">Statistik Laga</h4>
              {Object.keys(match.stats).map((key) => {
                const stat = match.stats[key];
                const total = stat.teamA + stat.teamB;
                const percentA = total > 0 ? (stat.teamA / total) * 100 : 50;

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono px-1">
                      <span className="font-bold text-white">{stat.teamA}</span>
                      <span className="capitalize text-gray-400 text-[11px]">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-bold text-white">{stat.teamB}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden flex">
                      <div style={{ width: `${percentA}%`, backgroundColor: theme.color }} className="h-full transition-all duration-500" />
                      <div style={{ width: `${100 - percentA}%` }} className="bg-yellow-600 h-full transition-all duration-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {match.events && (
            <div className="bg-gray-900/30 border border-gray-800/80 p-4 rounded-xl col-span-1 lg:col-span-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Jalannya Pertandingan</h4>
              <div className="space-y-2.5">
                {match.events.map((event, index) => (
                  <div key={index} className={`flex items-center gap-3 text-sm ${event.team === 'A' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <span className="font-mono text-xs text-amber-500 font-bold bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                      {event.minute}
                    </span>
                    <div className="flex items-center gap-2 bg-gray-900/90 px-3 py-1.5 rounded-xl border border-gray-800 text-gray-200">
                      <span>{event.type === 'Goal' ? '⚽' : '🟨'}</span>
                      <span className="font-medium text-xs md:text-sm">{event.player}</span>
                    </div>
                    <div className="flex-1 border-b border-dashed border-gray-800/80"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 4. KOMPONEN UTAMA DASHBOARD
export default function LiveSportsDashboard() {
  const [liveSportsData, setLiveSportsData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('timnas');

  useEffect(() => {
    const sportsRef = ref(db, 'sportsData');
    const unsubscribe = onValue(sportsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLiveSportsData(data);
      } else {
        setLiveSportsData({});
      }
    });

    return () => unsubscribe();
  }, []);

  const currentTheme = sportTheme[activeCategory] || sportTheme.timnas;

  if (liveSportsData === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-t-red-600 border-gray-800 rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400 tracking-widest uppercase">Menghubungkan ke server live...</p>
        </div>
      </div>
    );
  }

  const currentMatches = liveSportsData[activeCategory]?.matches || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
      {/* Banner Top */}
      <div 
        className="relative h-48 md:h-56 bg-cover bg-center transition-all duration-300 flex items-end p-6"
        style={{ backgroundImage: `linear-gradient(to top, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0.2)), url(${currentTheme.banner})` }}
      >
        <div className="flex items-center gap-3 z-10">
          <span className="text-4xl bg-gray-800/90 p-2.5 rounded-xl border border-gray-700/50 backdrop-blur-sm">
            {currentTheme.icon}
          </span>
          <div>
            <h1 className="text-xl md:text-3xl font-black tracking-tight">{currentTheme.name}</h1>
            <p className="text-[10px] md:text-xs text-gray-300 mt-1 uppercase font-bold tracking-widest bg-black/50 px-2 py-0.5 rounded inline-block">
              {currentTheme.type}
            </p>
          </div>
        </div>
      </div>

      {/* Navigasi Kategori */}
      <div className="sticky top-0 z-20 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 py-3 px-4 flex gap-3 overflow-x-auto">
        {Object.keys(sportTheme).map((key) => {
          const theme = sportTheme[key];
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all border ${
                isActive 
                  ? 'border-transparent text-white shadow-md' 
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
              style={isActive ? { backgroundColor: theme.color } : {}}
            >
              <span>{theme.icon}</span>
              <span>{theme.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content List */}
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: currentTheme.color }} />
            Daftar Live / Hasil Laga
          </h2>
          <span className="text-[11px] font-mono text-gray-400 bg-gray-950 border border-gray-800 px-2.5 py-0.5 rounded-full">
            {currentMatches.length} Match Available
          </span>
        </div>

        {currentMatches.length === 0 ? (
          <div className="text-center py-12 bg-gray-950/50 rounded-2xl border border-gray-800 border-dashed">
            <p className="text-xs md:text-sm text-gray-500 font-medium">Tidak ada jadwal pertandingan aktif pada kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {currentMatches.map((match) => (
              <MatchCard key={match.id} match={match} theme={currentTheme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}