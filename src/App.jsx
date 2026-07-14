import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SportPage from "./pages/SportPage";

function App() {
  return (
    <HashRouter>
      <div className="relative min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sport/:category" element={<SportPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;