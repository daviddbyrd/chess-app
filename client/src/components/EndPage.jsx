import React from "react";

const EndPage = ({ state, turn, rematch }) => {
  console.log(state);
  console.log(turn);
  const convert = { w: "Black", b: "White" };
  return (
    <div className="absolute inset-0 m-auto w-32 h-32 bg-white flex flex-col items-center justify-center rounded-lg border-4 border-black">
      {state === "checkmate" ? (
        <div className="text-center">{convert[turn]} wins by Checkmate</div>
      ) : (
        <div className="text-center">Stalemate!</div>
      )}
      <button
        className="rounded-md border-1 border-black cursor-pointer"
        onClick={rematch}
      >
        Rematch
      </button>
    </div>
  );
};

export default EndPage;
