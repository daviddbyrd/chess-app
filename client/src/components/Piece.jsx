import React from "react";

const Piece = ({ row, col, piece, handleClick }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", `${piece}${row}${col}`);
    const img = new Image();
    img.src = `../../${piece}.png`;
    e.dataTransfer.setDragImage(img, 40, 40);
    e.target.style.opacity = "0";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
  };

  return (
    <div
      className="aspect-square bg-cover bg-center cursor-grab active:cursor-grabbing"
      style={{ backgroundImage: `url('../../${piece}.png')` }}
      onClick={() => handleClick(row, col, piece)}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    ></div>
  );
};

export default Piece;
