import React from "react";
import Piece from "./Piece";

const PromotionMenu = ({ row, col, turn, width, handlePromotionClick }) => {
  const promotingOptions = [`${turn}q`, `${turn}r`, `${turn}b`, `${turn}n`];
  return (
    <>
      {turn === "w" ? (
        <div
          className="absolute"
          style={{ left: `${width * col}px`, top: `${width * (7 - row)}px` }}
        >
          {promotingOptions.map((piece, pieceIndex) => {
            return (
              <div className="w-20 h-20 bg-stone-200">
                <Piece
                  key={`${pieceIndex}`}
                  row={row}
                  col={col}
                  piece={piece}
                  handleClick={() => handlePromotionClick(row, col, piece)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="absolute"
          style={{ left: `${width * col}px`, top: `${width * (4 - row)}px` }}
        >
          {promotingOptions.toReversed().map((piece, pieceIndex) => {
            return (
              <div className="w-20 h-20 bg-stone-200">
                <Piece
                  key={`${pieceIndex}`}
                  row={row}
                  col={col}
                  piece={piece}
                  handleClick={() => handlePromotionClick(row, col, piece)}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default PromotionMenu;
