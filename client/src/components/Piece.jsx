import React from "react";

const Piece = ({ row, col, piece, handleClick }) => {
  return (
    <div
      className="w-20 h-20 bg-cover bg-center"
      style={{ backgroundImage: `url('../../public/${piece}.png')` }}
      onClick={() => handleClick(row, col, piece)}
    ></div>
  );
};

export default Piece;
