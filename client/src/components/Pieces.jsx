import { useState } from "react";
import Piece from "./Piece.jsx";

const Pieces = () => {
  const [pieces, setPieces] = useState([
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
  ]);

  const rows = 8;
  const cols = 8;

  const handleClick = () => {
    return;
  };

  return (
    <div className="grid grid-cols-8 absolute top-0 left-0">
      {pieces.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <Piece
            row={rowIndex}
            col={colIndex}
            piece={piece}
            handleClick={handleClick}
          />
        ))
      )}
    </div>
  );
};

export default Pieces;
