import React from "react";

const Square = ({ row, col, piece }) => {
  return (
    <div
      className={`aspect-square ${
        (row + col) % 2 === 0 ? "bg-stone-500" : "bg-white"
      }`}
    ></div>
  );
};

export default Square;
