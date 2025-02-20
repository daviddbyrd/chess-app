import React from "react";
import Board from "../components/Board";
import Pieces from "../components/Pieces";

const MainPage = () => {
  return (
    <div className="relative">
      <Board />
      <Pieces />
    </div>
  );
};

export default MainPage;
