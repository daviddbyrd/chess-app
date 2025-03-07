import { isValidMove, isCheck, constructBoard } from "./Helper.js";

export const Bishop = {
  isValidMove: (pieces, oldRow, oldCol, newRow, newCol, turn) => {
    if (pieces[newRow][newCol]) {
      if (pieces[newRow][newCol][0] === turn) {
        return false;
      }
    }

    if (Math.abs(newRow - oldRow) !== Math.abs(newCol - oldCol)) {
      return false;
    }

    let rdif = 0;
    let cdif = 0;
    if (newRow > oldRow) {
      rdif = 1;
    } else {
      rdif = -1;
    }
    if (newCol > oldCol) {
      cdif = 1;
    } else {
      cdif = -1;
    }
    let r = oldRow;
    let c = oldCol;

    for (let i = 0; i < Math.abs(newRow - oldRow) - 1; i++) {
      r += rdif;
      c += cdif;
      if (pieces[r][c]) {
        return false;
      }
    }
    return true;
  },

  canStopCheck: (pieces, oldRow, oldCol, turn) => {
    const diag = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (let i = 0; i < 4; i++) {
      let rdif = diag[i][0];
      let cdif = diag[i][1];
      let newRow = oldRow + rdif;
      let newCol = oldCol + cdif;
      while (0 <= newRow && newRow < 8 && 0 <= newCol && newCol < 8) {
        if (isValidMove(pieces, oldRow, oldCol, newRow, newCol, turn)) {
          const newPieces = constructBoard(
            pieces,
            oldRow,
            oldCol,
            newRow,
            newCol
          );
          if (!isCheck(newPieces, turn)) {
            return true;
          }
        }
        newRow += rdif;
        newCol += cdif;
      }
    }
    return false;
  },
};
