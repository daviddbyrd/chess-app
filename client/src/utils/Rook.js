import { isCheck, constructBoard } from "./Helper.js";

export const Rook = {
  isValidMove: (pieces, oldRow, oldCol, newRow, newCol, turn) => {
    if (pieces[newRow][newCol]) {
      if (pieces[newRow][newCol][0] === turn) {
        return false;
      }
    }

    if (newRow === oldRow) {
      let dif = 0;
      if (newCol > oldCol) {
        dif = 1;
      } else {
        dif = -1;
      }
      let c = oldCol;
      for (let i = 0; i < Math.abs(newCol - oldCol) - 1; i++) {
        c += dif;
        if (pieces[newRow][c]) {
          return false;
        }
      }
    } else if (newCol === oldCol) {
      let dif = 0;
      if (newRow > oldRow) {
        dif = 1;
      } else {
        dif = -1;
      }
      let r = oldRow;
      for (let i = 0; i < Math.abs(newRow - oldRow) - 1; i++) {
        r += dif;
        if (pieces[r][newCol]) {
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  },

  canStopCheck: (pieces, oldRow, oldCol, turn) => {
    const ortho = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (let i = 0; i < 4; i++) {
      let rdif = ortho[i][0];
      let cdif = ortho[i][1];
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
  },
};
