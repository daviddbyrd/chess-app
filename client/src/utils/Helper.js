import { Pawn } from "./Pawn";
import { Bishop } from "./Bishop";
import { Rook } from "./Rook";
import { Knight } from "./Knight";
import { Queen } from "./Queen";
import { King } from "./King";

const pieceConvert = {
  p: Pawn,
  b: Bishop,
  r: Rook,
  n: Knight,
  q: Queen,
  k: King,
};

export const constructBoard = (pieces, oldRow, oldCol, newRow, newCol) => {
  const newPiece = pieces[oldRow][oldCol];
  const nextPieces = pieces.map((row, rowIndex) =>
    row.map((piece, colIndex) => {
      if (rowIndex === oldRow && colIndex === oldCol) {
        return null;
      } else if (rowIndex === newRow && colIndex === newCol) {
        return newPiece;
      } else {
        return piece;
      }
    })
  );
  return nextPieces;
};

export const isCheck = (pieces, turn) => {
  let kingRow = 0;
  let kingCol = 0;

  for (let row = 0; row < 8; ++row) {
    for (let col = 0; col < 8; ++col) {
      if (pieces[row][col] && pieces[row][col] === `${turn}k`) {
        kingRow = row;
        kingCol = col;
        break;
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
      if (pieces[r][c]) {
        if (pieces[r][c][0] === turn) {
          break;
        } else if (pieces[r][c][1] === "q" || pieces[r][c][1] === "b") {
          return true;
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
      if (pieces[r][c]) {
        if (pieces[r][c][0] === turn) {
          break;
        } else if (pieces[r][c][1] === "q" || pieces[r][c][1] === "r") {
          return true;
        }
      }
      r += rdif;
      c += cdif;
    }
  }

  if (turn === "w") {
    if (
      kingRow < 7 &&
      ((kingCol > 0 && pieces[kingRow + 1][kingCol - 1] === "bp") ||
        (kingCol < 7 && pieces[kingRow + 1][kingCol + 1] === "bp"))
    ) {
      return true;
    }
  } else {
    if (
      kingRow > 0 &&
      ((kingCol > 0 && pieces[kingRow - 1][kingCol - 1] === "wp") ||
        (kingCol < 7 && pieces[kingRow - 1][kingCol + 1] === "wp"))
    ) {
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
          pieces[r][c] &&
          pieces[r][c][0] != turn &&
          pieces[r][c][1] === "n"
        ) {
          return true;
        }
      }
      r = kingRow + difs[i] * 1;
      c = kingCol + difs[j] * 2;
      if (0 <= r && r < 8 && 0 <= c && c < 8) {
        if (
          pieces[r][c] &&
          pieces[r][c][0] != turn &&
          pieces[r][c][1] === "n"
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isValidMove = (...args) => {
  const [pieces, oldRow, oldCol, newRow, newCol, turn] = args;
  const currentPiece = pieces[oldRow][oldCol];

  if (!currentPiece || currentPiece[0] !== turn) {
    return false;
  }

  const PieceClass = pieceConvert[currentPiece[1]];

  if (!PieceClass.isValidMove(...args)) {
    return false;
  }

  const nextPieces = pieces.map((row, rowIndex) =>
    row.map((piece, colIndex) => {
      if (rowIndex === oldRow && colIndex === oldCol) {
        return null;
      } else if (rowIndex === newRow && colIndex === newCol) {
        return currentPiece;
      } else {
        return piece;
      }
    })
  );

  if (isCheck(nextPieces, turn)) {
    return false;
  }
  return true;
};

export const isCheckmate = (pieces, turn) => {
  if (!isCheck(pieces, turn)) {
    return false;
  }
  for (let row = 0; row < 8; ++row) {
    for (let col = 0; col < 8; ++col) {
      if (pieces[row][col] && pieces[row][col][0] === turn) {
        const PieceClass = pieceConvert[pieces[row][col][1]];
        if (PieceClass.canStopCheck(pieces, row, col, turn)) {
          return false;
        }
      }
    }
  }
  return true;
};
