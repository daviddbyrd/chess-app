import { isCheck, constructBoard } from "./Helper";

export const Pawn = {
  isValidMove: (pieces, oldRow, oldCol, newRow, newCol, turn) => {
    if (turn === "w") {
      if (pieces[newRow][newCol]) {
        if (pieces[newRow][newCol][0] === "w") {
          return false;
        }
        if (
          newRow - 1 === oldRow &&
          (newCol - 1 === oldCol || newCol + 1 === oldCol)
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (oldCol != newCol) {
          return false;
        }
        if (oldRow == 1) {
          if (2 <= newRow <= 3) {
            return true;
          } else {
            return false;
          }
        } else {
          if (newRow - 1 === oldRow) {
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
          newRow + 1 === oldRow &&
          (newCol - 1 === oldCol || newCol + 1 === oldCol)
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (oldCol != newCol) {
          return false;
        }
        if (oldRow == 6) {
          if (4 <= newRow <= 5) {
            return true;
          } else {
            return false;
          }
        } else {
          if (newRow + 1 === oldRow) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  },

  canStopCheck: (pieces, oldRow, oldCol, turn) => {
    const moves = [
      [1, 1],
      [1, 0],
      [1, -1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [2, 0],
      [-2, 0],
    ];
    for (let i = 0; i < moves.length; ++i) {
      let rdif = moves[i][0];
      let cdif = moves[i][1];
      let newRow = oldRow + rdif;
      let newCol = oldCol + cdif;
      if (0 <= newRow && newRow < 8 && 0 <= newCol && newCol < 8) {
        if (Pawn.isValidMove(pieces, oldRow, oldCol, newRow, newCol, turn)) {
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
      }
    }
    return false;
  },
};
