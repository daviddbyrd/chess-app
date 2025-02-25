import React from "react";

const Square = ({ row, col, piece }) => {
  return (
    <div
      className={`w-20 h-20 ${
        (row + col) % 2 === 0 ? "bg-stone-500" : "bg-white"
      }`}
    ></div>
  );
};

export default Square;
