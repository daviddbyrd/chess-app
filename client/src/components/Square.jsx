import React from "react";

const Square = ({ row, col }) => {
  const darkbrown = "#A97D54";
  const lightbrown = "#D3B895";

  return (
    <div
      className={`w-20 h-20 ${
        (row + col) % 2 === 0 ? "bg-green-300" : "bg-stone-300"
      }`}
    >
      {row}
      {String.fromCharCode(col + 97)}
    </div>
  );
};

export default Square;
