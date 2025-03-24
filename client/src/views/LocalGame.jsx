import React from "react";
import LocalPieces from "../components/LocalGameComponents/LocalPieces";

const LocalGame = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen  bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 backdrop-blur">
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl"></div>
      <div className="absolute -right-20 bottom-40 h-80 w-80 rounded-full bg-purple-100/30 blur-3xl"></div>
      <div className="absolute bottom-10 left-40 h-80 w-80 rounded-full bg-pink-100/30 blur-3xl"></div>
      <div className="flex flex-col items-center justify-center h-screen">
        <LocalPieces />
      </div>
    </div>
  );
};

export default LocalGame;
