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
};
