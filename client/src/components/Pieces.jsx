import { useState } from "react";
import Piece from "./Piece.jsx";
import { isValidMove } from "../utils/Helper.js";

const Pieces = () => {
  const [pieces, setPieces] = useState([
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
  ]);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("w");
  const [kingPos, setKingPos] = useState({
    w: { row: 0, col: 4 },
    b: { row: 7, col: 4 },
  });

  const movePiece = (newRow, newCol) => {
    if (
      isValidMove(
        pieces,
        currentPiece.row,
        currentPiece.col,
        newRow,
        newCol,
        currentTurn
      )
    ) {
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
      if (currentPiece.piece[1] === "k") {
        setKingPos({ ...kingPos, currentTurn: { row: newRow, col: newCol } });
      }
      if (currentTurn === "b") {
        setCurrentTurn("w");
      } else {
        setCurrentTurn("b");
      }
    }
    setCurrentPiece(null);
  };

  const handleClick = (row, col, piece) => {
    if (currentPiece) {
      movePiece(row, col);
    } else {
      if (piece) {
        setCurrentPiece({ row, col, piece });
      }
    }
  };

  return (
    <div className="grid grid-cols-8 absolute">
      {pieces.toReversed().map((row, reversedIndex) => {
        const rowIndex = 7 - reversedIndex;
        return row.map((piece, colIndex) => (
          <Piece
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            piece={piece}
            handleClick={handleClick}
          />
        ));
      })}
    </div>
  );
};

export default Pieces;
