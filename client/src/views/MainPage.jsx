import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  const gameTypes = [
    { name: "Play Locally", path: "localgame" },
    { name: "Play Online", path: "onlinegame" },
    { name: "Play vs Computer", path: "computergame" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div></div>
      {gameTypes.map((gameType) => (
        <button
          key={gameType.name}
          onClick={() => navigate(gameType.path)}
          className="w-70 h-15 bg-red-400 m-4 rounded-lg cursor-grab"
        >
          {gameType.name}
        </button>
      ))}
    </div>
  );
};

export default MainPage;
