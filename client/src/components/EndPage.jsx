import React from "react";

const EndPage = ({ state, turn, rematch }) => {
  console.log(state);
  console.log(turn);
  const convert = { w: "Black", b: "White" };
  return (
    <div className="absolute inset-0 m-auto w-60 h-80 bg-white flex flex-col justify-center items-center rounded-xl shadow-lg">
      {state === "checkmate" ? (
        <div className="text-center mt-20 text-4xl text-gray-900">
          {convert[turn]} wins by Checkmate
        </div>
      ) : (
        <div className="text-center">Match Ended in Stalemate</div>
      )}
      <button
        className="rounded-md cursor-pointer mt-10 mb-10 w-40 h-20 shadow-lg bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 backdrop-blur text-2xl"
        onClick={rematch}
      >
        Rematch
      </button>
    </div>
  );
};

export default EndPage;
