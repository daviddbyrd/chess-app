import React from "react";
import Board from "../components/Board";
import Pieces from "../components/Pieces";

const MainPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Board />
      <Pieces />
    </div>
  );
};

export default MainPage;
