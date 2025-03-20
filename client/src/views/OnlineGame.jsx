import React from "react";
import Board from "../components/Board";
import Pieces from "../components/Pieces";

const OnlineGame = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="h-3/10 w-3/10 absolute">
        <Board />
        <Pieces />
      </div>
    </div>
  );
};

export default OnlineGame;
