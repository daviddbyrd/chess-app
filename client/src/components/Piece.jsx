import React from "react";

const Piece = ({ row, col, piece, handleClick }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", `${piece}${row}${col}`);
    console.log(e);
  };

  return (
    <div
      className="w-20 h-20 bg-cover bg-center"
      style={{ backgroundImage: `url('../../public/${piece}.png')` }}
      onClick={() => handleClick(row, col, piece)}
      draggable="true"
      onDragStart={handleDragStart}
    ></div>
  );
};

export default Piece;
