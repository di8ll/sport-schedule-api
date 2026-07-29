import { useParams } from "react-router-dom";

import SportPage from "./SportPage";
import SportPageExternal from "./SportPageExternal";
import { sportTheme } from "../data/sportsData";

// ⬇️ SportPageRouter cuma tugasnya MEMILIH komponen mana yang harus
// dirender berdasarkan "category" di URL (/sport/:category).
//
// - Kalau category itu cabang EXTERNAL (isExternal: true di sportsData.js,
//   misal "volly" & "basket") -> render SportPageExternal
// - Kalau bukan (futsal, volley, catur, badminton, tenismeja, padel)
//   -> render SportPage (internal) seperti biasa
//
// SportPage & SportPageExternal sendiri TIDAK diubah sama sekali di sini.

const SportPageRouter = () => {
  const { category } = useParams();

  const theme = sportTheme[category];
  const isExternal = theme?.isExternal === true;

  if (isExternal) {
    return <SportPageExternal />;
  }

  return <SportPage />;
};

export default SportPageRouter;