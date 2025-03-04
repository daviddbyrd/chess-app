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

  const isValidPawnMove = (newRow, newCol) => {
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

  const isValidKnightMove = (newRow, newCol) => {
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

  const isValidBishopMove = (newRow, newCol) => {
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

  const isValidRookMove = (newRow, newCol) => {
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

  const isValidQueenMove = (newRow, newCol) => {
    return isValidRookMove(newRow, newCol) || isValidBishopMove(newRow, newCol);
  };

  const isValidKingMove = (newRow, newCol) => {
    if (pieces[newRow][newCol]) {
      if (pieces[newRow][newCol][0] === currentTurn) {
        return false;
      }
    }
    if (
      Math.abs(newRow - currentPiece.row) <= 1 &&
      Math.abs(newCol - currentPiece.col) <= 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isCheck = (newPieces, turn) => {
    let kingRow = 0;
    let kingCol = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (newPieces[row][col] === `${turn}k`) {
          kingRow = row;
          kingCol = col;
        }
      }
    }

    const diag = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (let i = 0; i < 4; i++) {
      let rdif = diag[i][0];
      let cdif = diag[i][1];
      let r = kingRow + rdif;
      let c = kingCol + cdif;
      while (0 <= r && r < 8 && 0 <= c && c < 8) {
        if (newPieces[r][c]) {
          if (newPieces[r][c][0] === turn) {
            break;
          } else if (newPieces[r][c][1] === "q" || newPieces[r][c][1] === "b") {
            console.log("1");
            return true;
          } else {
            break;
          }
        }
        r += rdif;
        c += cdif;
      }
    }

    const ortho = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (let i = 0; i < 4; i++) {
      let rdif = ortho[i][0];
      let cdif = ortho[i][1];
      let r = kingRow + rdif;
      let c = kingCol + cdif;
      while (0 <= r && r < 8 && 0 <= c && c < 8) {
        if (newPieces[r][c]) {
          if (newPieces[r][c][0] === turn) {
            break;
          } else if (newPieces[r][c][1] === "q" || newPieces[r][c][1] === "r") {
            console.log("2");
            return true;
          } else {
            break;
          }
        }
        r += rdif;
        c += cdif;
      }
    }

    if (turn === "w") {
      if (
        kingRow < 7 &&
        ((kingCol > 0 && newPieces[kingRow + 1][kingCol - 1] === "bp") ||
          (kingCol < 7 && newPieces[kingRow + 1][kingCol + 1] === "bp"))
      ) {
        console.log("3");
        return true;
      }
    } else {
      if (
        kingRow > 0 &&
        ((kingCol > 0 && newPieces[kingRow - 1][kingCol - 1] === "wp") ||
          (kingCol < 7 && newPieces[kingRow - 1][kingCol + 1] === "wp"))
      ) {
        console.log("4");
        return true;
      }
    }

    const difs = [-1, 1];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        let r = kingRow + difs[i] * 2;
        let c = kingCol + difs[j] * 1;
        if (0 <= r && r < 8 && 0 <= c && c < 8) {
          if (
            newPieces[r][c] &&
            newPieces[r][c][0] != turn &&
            newPieces[r][c][1] === "n"
          ) {
            console.log("5");
            return true;
          }
        }
        r = kingRow + difs[i] * 1;
        c = kingCol + difs[j] * 2;
        if (0 <= r && r < 8 && 0 <= c && c < 8) {
          if (
            newPieces[r][c] &&
            newPieces[r][c][0] != turn &&
            newPieces[r][c][1] === "n"
          ) {
            console.log("6");
            return true;
          }
        }
      }
    }
    return false;
  };

  const isValidMove = (newRow, newCol) => {
    if (currentTurn != currentPiece.piece[0]) {
      return false;
    }

    if (currentPiece.piece[1] === "p") {
      if (!isValidPawnMove(newRow, newCol)) {
        return false;
      }
    }

    if (currentPiece.piece[1] === "n") {
      if (!isValidKnightMove(newRow, newCol)) {
        return false;
      }
    }

    if (currentPiece.piece[1] === "b") {
      if (!isValidBishopMove(newRow, newCol)) {
        return false;
      }
    }

    if (currentPiece.piece[1] === "r") {
      if (!isValidRookMove(newRow, newCol)) {
        return false;
      }
    }

    if (currentPiece.piece[1] === "q") {
      if (!isValidQueenMove(newRow, newCol)) {
        return false;
      }
    }

    if (currentPiece.piece[1] === "k") {
      if (!isValidKingMove(newRow, newCol)) {
        return false;
      }
    }

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

    if (isCheck(nextPieces, currentTurn)) {
      return false;
    }
    return true;
  };

  const createPieces = (oldPieces, oldRow, oldCol, newRow, newCol) => {
    const newPieces = oldPieces.map((row, rowIndex) =>
      row.map((piece, colIndex) => {
        if (rowIndex === oldRow && colIndex === oldCol) {
          return null;
        } else if (rowIndex === newRow && colIndex === newCol) {
          return currentPiece.piece;
        } else {
          return piece;
        }
      })
    );
    return newPieces;
  };

  const tryKnightMoves = (newPieces, turn, row, col) => {
    const difs = [-1, 1];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        let r = row + difs[i] * 2;
        let c = col + difs[j] * 1;

        const piecesAfterMove = createPieces(newPieces, row, col, r, c);
        if (!isCheck(piecesAfterMove)) {
          return true;
        }
        r = row + difs[i] * 1;
        c = col + difs[j] * 2;
        piecesAfterMove = createPieces(newPieces, roll, col, r, c);
        if (!isCheck(piecesAfterMove)) {
          return true;
        }
      }
    }
  };

  const tryBishopMoves = (newPieces, turn, )

  const isCheckMate = (newPieces, turn) => {
    for (let row = 0; row < 8; ++row) {
      for (let col = 0; col < 8; ++col) {
        if (newPieces[row][col] && newPieces[row][col][0] === "turn") {
          if (newPieces[row][col][1] === "b") {
          } else if (newPieces[row][col][1] === "n") {
            if (tryKnightMoves(newPieces, turn, row, col)) {
              return false;
            }
          } else if (newPieces[row][col][1] === "b") {
            if (tryBishopMoves(newPieces, turn, row, col)) {
              return false;
            }
          } else if (newPieces[row][col][1] === "r") {
            if (tryRookMoves(newPieces, turn, row, col)) {
              return false;
            }
          } else if (newPieces[row][col][1] === "q") {
            if (tryQueenMoves(newPieces, turn, row, col)) {
              return false;
            }
          } else if (newPieces[row][col][1] === "k") {
            if (tryKingMoves(newPieces, turn, row, col)) {
              return false;
            }
          }
        }
      }
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

      if (currentTurn === "b") {
        if (isCheck(nextPieces, "w")) {
          if (isCheckMate(nextPieces, "w")) {
            console.log("checkmate");
          }
        }
        setCurrentTurn("w");
      } else {
        if (isCheck(nextPieces, "b")) {
          if (isCheckMate(nextPieces, "b")) {
            console.log("checkmate");
          }
        }
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
