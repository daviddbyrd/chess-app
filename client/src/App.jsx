import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./views/MainPage.jsx";
import LocalGame from "./views/LocalGame.jsx";
import OnlineGame from "./views/OnlineGame.jsx";
import ComputerGame from "./views/ComputerGame.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/localgame" element={<LocalGame />} />
        <Route path="/onlinegame" element={<OnlineGame />} />
        <Route path="/computergame" element={<ComputerGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
