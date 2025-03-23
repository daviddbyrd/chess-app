import React from "react";

const PieceIcon = ({ piece }) => {
  return (
    <div
      className="aspect-square bg-cover bg-center"
      style={{ backgroundImage: `url('../../${piece}.png')` }}
    ></div>
  );
};

export default PieceIcon;
