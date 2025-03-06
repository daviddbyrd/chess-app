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
};
