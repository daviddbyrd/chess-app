import { Pawn } from "./Pawn";
import { Bishop } from "./Bishop";
import { Rook } from "./Rook";
import { Knight } from "./Knight";
import { Queen } from "./Queen";
import { King } from "./King";
import axios from "axios";

const pieceConvert = {
  p: Pawn,
  b: Bishop,
  r: Rook,
  n: Knight,
  q: Queen,
  k: King,
};

export const constructBoard = (pieces, oldRow, oldCol, newRow, newCol) => {
  if (pieces[oldRow][oldCol][1] === "k" && Math.abs(oldCol - newCol) > 1) {
    return constructCastleBoard(pieces, oldRow, oldCol, newRow, newCol);
  } else if (
    pieces[oldRow][oldCol][1] === "p" &&
    !pieces[newRow][newCol] &&
    oldCol !== newCol
  ) {
    return constructEnPassantBoard(pieces, oldRow, oldCol, newRow, newCol);
  }
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

export const constructBoardPromotion = (pieces, newRow, newCol, newPiece) => {
  const nextPieces = pieces.map((row, rowIndex) =>
    row.map((piece, colIndex) => {
      if (rowIndex === newRow && colIndex === newCol) {
        return newPiece;
      } else {
        return piece;
      }
    })
  );
  return nextPieces;
};

export const isCheck = (pieces, turn) => {
  for (let row = 0; row < 8; ++row) {
    for (let col = 0; col < 8; ++col) {
      if (pieces[row][col] && pieces[row][col] === `${turn}k`) {
        return isTargeted(pieces, turn, row, col);
      }
    }
  }
};

export const isPromoting = (pieces) => {
  for (let col = 0; col < 8; ++col) {
    if (pieces[0][col] === "bp" || pieces[7][col] === "wp") {
      return true;
    }
  }
  return false;
};

export const isTargeted = (pieces, turn, targRow, targCol) => {
  const diag = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  for (let i = 0; i < 4; i++) {
    let rdif = diag[i][0];
    let cdif = diag[i][1];
    let r = targRow + rdif;
    let c = targCol + cdif;
    while (0 <= r && r < 8 && 0 <= c && c < 8) {
      if (pieces[r][c]) {
        if (pieces[r][c] !== turn) {
          break;
        } else if (pieces[r][c][1] === "q" || pieces[r][c][1] === "b") {
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
    let r = targRow + rdif;
    let c = targCol + cdif;
    while (0 <= r && r < 8 && 0 <= c && c < 8) {
      if (pieces[r][c]) {
        if (pieces[r][c][0] === turn) {
          break;
        } else if (pieces[r][c][1] === "q" || pieces[r][c][1] === "r") {
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
      targRow < 7 &&
      ((targCol > 0 && pieces[targRow + 1][targCol - 1] === "bp") ||
        (targCol < 7 && pieces[targRow + 1][targCol + 1] === "bp"))
    ) {
      return true;
    }
  } else {
    if (
      targRow > 0 &&
      ((targCol > 0 && pieces[targRow - 1][targCol - 1] === "wp") ||
        (targCol < 7 && pieces[targRow - 1][targCol + 1] === "wp"))
    ) {
      return true;
    }
  }

  const difs = [-1, 1];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      let r = targRow + difs[i] * 2;
      let c = targCol + difs[j] * 1;
      if (0 <= r && r < 8 && 0 <= c && c < 8) {
        if (
          pieces[r][c] &&
          pieces[r][c][0] != turn &&
          pieces[r][c][1] === "n"
        ) {
          return true;
        }
      }
      r = targRow + difs[i] * 1;
      c = targCol + difs[j] * 2;
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
  const [
    pieces,
    oldRow,
    oldCol,
    newRow,
    newCol,
    turn,
    castlingAvailability,
    enPassantAvailability,
  ] = args;
  const currentPiece = pieces[oldRow][oldCol];

  if (
    isValidCastle(
      pieces,
      oldRow,
      oldCol,
      newRow,
      newCol,
      turn,
      castlingAvailability
    )
  ) {
    return true;
  }

  if (!currentPiece || currentPiece[0] !== turn) {
    return false;
  }

  if (currentPiece[1] == "p") {
    if (
      !Pawn.isValidMove(
        pieces,
        oldRow,
        oldCol,
        newRow,
        newCol,
        turn,
        enPassantAvailability
      )
    ) {
      return false;
    }
  } else {
    const PieceClass = pieceConvert[currentPiece[1]];

    if (!PieceClass.isValidMove(pieces, oldRow, oldCol, newRow, newCol, turn)) {
      return false;
    }
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

export const isStalemate = (pieces, turn) => {
  if (isCheck(pieces, turn)) {
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

export const isValidCastle = (
  pieces,
  oldRow,
  oldCol,
  newRow,
  newCol,
  turn,
  castlingAvailability
) => {
  if (pieces[oldRow][oldCol][1] !== "k") {
    return false;
  }

  if (newCol === 6) {
    if (pieces[oldRow][oldCol][0] === "w") {
      if (!(oldRow === 0 && newRow === 0 && castlingAvailability[0] === "K")) {
        return false;
      }
    } else {
      if (!(oldRow === 7 && newRow === 7 && castlingAvailability[2] === "k")) {
        return false;
      }
    }
    for (let i = 5; i < 7; i++) {
      if (pieces[oldRow][i] || isTargeted(pieces, turn, oldRow, i)) {
        return false;
      }
    }
    return true;
  } else if (newCol == 2) {
    if (pieces[oldRow][oldCol][0] === "w") {
      if (!(oldRow === 0 && newRow === 0 && castlingAvailability[1] === "Q")) {
        return false;
      }
    } else {
      if (!(oldRow === 7 && newRow === 7 && castlingAvailability[3] === "q")) {
        return false;
      }
    }
    for (let i = 5; i < 7; i++) {
      if (pieces[oldRow][i] || isTargeted(pieces, turn, oldRow, i)) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
};

export const constructCastleBoard = (
  pieces,
  oldRow,
  oldCol,
  newRow,
  newCol
) => {
  let rookOldCol = 0;
  let rookNewCol = 0;

  if (newCol === 6) {
    rookOldCol = 7;
    rookNewCol = 5;
  } else {
    rookOldCol = 0;
    rookNewCol = 3;
  }
  const king = pieces[oldRow][oldCol];
  const rook = `${pieces[oldRow][oldCol][0]}r`;
  const nextPieces = pieces.map((row, rowIndex) =>
    row.map((piece, colIndex) => {
      if (rowIndex === oldRow && colIndex === oldCol) {
        return null;
      } else if (rowIndex === oldRow && colIndex === rookOldCol) {
        return null;
      } else if (rowIndex === newRow && colIndex === newCol) {
        return king;
      } else if (rowIndex === oldRow && colIndex === rookNewCol) {
        return rook;
      } else {
        return piece;
      }
    })
  );
  return nextPieces;
};

export const constructEnPassantBoard = (
  pieces,
  oldRow,
  oldCol,
  newRow,
  newCol
) => {
  let takenPawnRow = oldRow;
  let takenPawnCol = newCol;

  const pawn = pieces[oldRow][oldCol];

  const nextPieces = pieces.map((row, rowIndex) =>
    row.map((piece, colIndex) => {
      if (rowIndex === oldRow && colIndex === oldCol) {
        return null;
      } else if (rowIndex === takenPawnRow && colIndex === takenPawnCol) {
        return null;
      } else if (rowIndex === newRow && colIndex === newCol) {
        return pawn;
      } else {
        return piece;
      }
    })
  );
  return nextPieces;
};

export const getSquareSize = (boardRef) => {
  const boardRect = boardRef.current.getBoundingClientRect();
  return boardRect.width / 8;
};

export const findTakenPiece = (
  pieces,
  oldRow,
  oldCol,
  newRow,
  newCol,
  turn
) => {
  if (pieces[newRow][newCol]) {
    return pieces[newRow][newCol];
  }
  if (oldCol !== newCol && pieces[oldRow][oldCol][1] === "p") {
    if (turn === "w") {
      return "bp";
    } else {
      return "wp";
    }
  }
  return null;
};

export const convertCastlingAvailability = (piece, col) => {
  if (piece[0] === "w") {
    if (piece[1] === "k") {
      return [0, 1];
    } else {
      if (col === 0) {
        return [1];
      } else {
        return [0];
      }
    }
  } else {
    if (piece[1] === "k") {
      return [2, 3];
    } else {
      if (col == 0) {
        return [2];
      } else {
        return [3];
      }
    }
  }
};

export const getEnPassantTarget = (enPassantAvailability) => {
  if (enPassantAvailability === null) {
    return "-";
  }
  const col = String.fromCharCode(enPassantAvailability.charCodeAt(0) + 49);
  const row = String.fromCharCode(enPassantAvailability.charCodeAt(0) + 1);
  return `${col}${row}`;
};

export const isEnPassantTarget = (pieces, oldRow, oldCol, newRow, newCol) => {
  if (pieces[oldRow][oldCol][1] === "p" && Math.abs(oldRow - newRow) > 1) {
    return true;
  } else {
    return false;
  }
};

export const fenConvertor = (
  pieces,
  turn,
  castlingAvailability,
  enPassantAvailability,
  halfMoveClock,
  turnCount
) => {
  let fenString = [];
  let cur = 0;
  for (let row = 7; row >= 0; row--) {
    cur = 0;
    for (let col = 0; col < 8; col++) {
      if (pieces[row][col]) {
        if (cur !== 0) {
          fenString.push(cur);
          cur = 0;
        }
        if (pieces[row][col][0] === "w") {
          fenString.push(pieces[row][col][1].toUpperCase());
        } else {
          fenString.push(pieces[row][col][1]);
        }
      } else {
        cur += 1;
      }
    }
    if (cur !== 0) {
      fenString.push(cur);
    }
    if (row !== 0) {
      fenString.push("/");
    }
  }
  fenString.push(` ${turn}`);
  fenString.push(` ${castlingAvailability.join("")}`);

  const enPassantTarget = getEnPassantTarget(enPassantAvailability);
  fenString.push(` ${enPassantTarget}`);
  fenString.push(` ${halfMoveClock}`);
  fenString.push(` ${turnCount}`);
  return fenString.join("");
};

export const getEngineMove = async (fenBoard) => {
  const engineMoveData = await axios.get(
    "https://stockfish.online/api/s/v2.php",
    {
      params: {
        fen: fenBoard,
        depth: 5,
      },
    }
  );
  return engineMoveData.data.continuation;
};
