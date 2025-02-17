import { useState } from "react";
import Square from "./Square.jsx";

const Board = () => {
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

  return (
    <div className="grid grid-cols-8">
      {pieces.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <Square row={rowIndex} col={colIndex} piece={piece} />
        ))
      )}
    </div>
  );
};

export default Board;
