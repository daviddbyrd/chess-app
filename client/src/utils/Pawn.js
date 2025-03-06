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
};
