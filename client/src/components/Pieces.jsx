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
        if (pieces[newRow][newCol][0] === "w") {
          return false;
        }
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
        if (pieces[newRow][newCol] === "b") {
          return false;
        }
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

  const isValidKnight = (newRow, newCol) => {
    if (pieces[newRow][newCol]) {
      if (pieces[newRow][newCol][0] === currentTurn) {
        return false;
      }
    }
    if (
      (Math.abs(newRow - currentPiece.row) === 2 &&
        Math.abs(newCol - currentPiece.col) === 1) ||
      (Math.abs(newRow - currentPiece.row) === 1 &&
        Math.abs(newCol - currentPiece.col) === 2)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isValidBishop = (newRow, newCol) => {
    if (pieces[newRow][newCol]) {
      if (pieces[newRow][newCol][0] === currentTurn) {
        return false;
      }
    }

    if (
      Math.abs(newRow - currentPiece.row) != Math.abs(newCol - currentPiece.col)
    ) {
      return false;
    }

    let rdif = 0;
    let cdif = 0;
    if (newRow > currentPiece.row) {
      rdif = 1;
    } else {
      rdif = -1;
    }
    if (newCol > currentPiece.col) {
      cdif = 1;
    } else {
      cdif = -1;
    }
    let r = currentPiece.row;
    let c = currentPiece.col;

    for (let i = 0; i < Math.abs(newRow - currentPiece.row) - 1; i++) {
      r += rdif;
      c += cdif;
      if (pieces[r][c]) {
        return false;
      }
    }
    return true;
  };

  const isValidRook = (newRow, newCol) => {
    if (pieces[newRow][newCol]) {
      if (pieces[newRow][newCol][0] === currentTurn) {
        return false;
      }
    }

    if (newRow === currentPiece.row) {
      let dif = 0;
      if (newCol > currentPiece.col) {
        dif = 1;
      } else {
        dif = -1;
      }
      let c = currentPiece.col;
      for (let i = 0; i < Math.abs(newCol - currentPiece.col) - 1; i++) {
        c += dif;
        if (pieces[newRow][c]) {
          return false;
        }
      }
    } else if (newCol === currentPiece.col) {
      let dif = 0;
      if (newRow > currentPiece.row) {
        dif = 1;
      } else {
        dif = -1;
      }
      let r = currentPiece.row;
      for (let i = 0; i < Math.abs(newRow - currentPiece.row) - 1; i++) {
        r += dif;
        if (pieces[r][newCol]) {
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  };

  const isValidMove = (newRow, newCol) => {
    if (currentTurn != currentPiece.piece[0]) {
      return false;
    }

    if (currentPiece.piece[1] === "p") {
      return isValidPawn(newRow, newCol);
    }

    if (currentPiece.piece[1] === "n") {
      return isValidKnight(newRow, newCol);
    }

    if (currentPiece.piece[1] === "b") {
      return isValidBishop(newRow, newCol);
    }

    if (currentPiece.piece[1] === "r") {
      return isValidRook(newRow, newCol);
    }

    return false;
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
