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
  const [currentPiece, setCurrentPiece] = useState(null);

  const rows = 8;
  const cols = 8;

  const isValidMove = (newRow, newCol) => {
    return true;
  };

  const movePiece = (newRow, newCol) => {
    if (isValidMove(newRow, newCol)) {
      const nextPieces = pieces.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          if (rowIndex === currentPiece.row && colIndex === currentPiece.col) {
            return null;
          } else if (rowIndex === newRow && colIndex === newCol) {
            return currentPiece.piece;
          } else {
            return piece;
          }
        })
      );
      setPieces(nextPieces);
      setCurrentPiece(null);
    }
  };

  const handleClick = (row, col, piece) => {
    if (currentPiece) {
      movePiece(row, col);
    } else {
      setCurrentPiece({ row, col, piece });
    }
  };

  return (
    <div className="grid grid-cols-8 absolute">
      {pieces.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <Piece
            key={`${rowIndex}-${colIndex}`}
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
