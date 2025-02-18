import React from "react";

const Square = ({ row, col, piece }) => {
  return (
    <div
      className={`w-20 h-20 ${
        (row + col) % 2 === 0 ? "bg-green-300" : "bg-stone-300"
      }`}
    >
      {piece && <img className="w-20 h-20" src={`../assets/${piece}.png`} />}
      {row}
      {String.fromCharCode(col + 97)}
    </div>
  );
};

export default Square;
