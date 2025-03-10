import { isCheck, constructBoard } from "./Helper";

export const King = {
  isValidMove: (pieces, oldRow, oldCol, newRow, newCol, turn) => {
    if (pieces[newRow][newCol]) {
      if (pieces[newRow][newCol][0] === turn) {
        return false;
      }
    }
    if (turn == "w") {
      if (oldRow === 0 && newRow === 0) {
      }
    } else {
    }

    if (Math.abs(newRow - oldRow) <= 1 && Math.abs(newCol - oldCol) <= 1) {
      return true;
    } else {
      return false;
    }
  },

  canStopCheck: (pieces, oldRow, oldCol, turn) => {
    const moves = [
      [1, 1],
      [1, 0],
      [1, -1],
      [0, 1],
      [0, -1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ];
    for (let i = 0; i < moves.length; ++i) {
      let rdif = moves[i][0];
      let cdif = moves[i][1];
      let newRow = oldRow + rdif;
      let newCol = oldCol + cdif;

      if (0 <= newRow && newRow < 8 && 0 <= newCol && newCol < 8) {
        if (King.isValidMove(pieces, oldRow, oldCol, newRow, newCol, turn)) {
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
