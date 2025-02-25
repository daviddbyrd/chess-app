import { useState } from "react";
import Piece from "./Piece.jsx";

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

  const isValidPawn = (newRow, newCol) => {
    if (currentTurn === "w") {
      if (pieces[newRow][newCol]) {
        if (
          newRow - 1 === currentPiece.row &&
          (newCol - 1 === currentPiece.col || newCol + 1 === currentPiece.col)
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (currentPiece.col != newCol) {
          return false;
        }
        if (currentPiece.row == 1) {
          if (2 <= newRow <= 3) {
            return true;
          } else {
            return false;
          }
        } else {
          if (newRow - 1 === currentPiece.row) {
            return true;
          } else {
            return false;
          }
        }
      }
    } else {
      if (pieces[newRow][newCol]) {
        if (
          newRow + 1 === currentPiece.row &&
          (newCol - 1 === currentPiece.col || newCol + 1 === currentPiece.col)
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (currentPiece.col != newCol) {
          return false;
        }
        if (currentPiece.row == 6) {
          if (4 <= newRow <= 5) {
            return true;
          } else {
            return false;
          }
        } else {
          if (newRow + 1 === currentPiece.row) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  };

  const isValidMove = (newRow, newCol) => {
    if (currentTurn != currentPiece.piece[0]) {
      return false;
    }

    if (currentPiece.piece[1] == "p") {
      return isValidPawn(newRow, newCol);
    }
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
    }
    setCurrentPiece(null);
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
