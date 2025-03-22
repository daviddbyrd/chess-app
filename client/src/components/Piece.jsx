import { React, useState } from "react";

const Piece = ({ row, col, piece, handleClick }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragged, setIsDragged] = useState(false);

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
      className={`aspect-square bg-cover bg-center cursor-grab border-3 active:cursor-grabbing 
        ${isDragOver ? "border-gray-400" : "border-transparent"}
      `}
      style={{ backgroundImage: `url('../../${piece}.png')` }}
      onClick={() => handleClick(row, col, piece)}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={() => setIsDragOver(true)}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={() => setIsDragOver(false)}
    ></div>
  );
};

export default Piece;
