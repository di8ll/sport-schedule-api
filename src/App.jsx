import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SportPageRouter from "./pages/SportPageRouter";

// ⬇️ App.jsx ini cuma ngatur ROUTING, nggak ada logic tambahan.
//
// Route "/sport/:category" DIARAHKAN KE SportPageRouter (bukan SportPage
// langsung), karena SportPageRouter yang bertugas milih:
// - kalau category-nya "volly" / "basket" -> render SportPageExternal
// - selain itu (futsal, volley, catur, badminton, tenismeja, padel)
//   -> render SportPage (internal) seperti biasa
//
// HomePage, SportPage, SportPageExternal semuanya TIDAK diubah sama sekali.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sport/:category" element={<SportPageRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;