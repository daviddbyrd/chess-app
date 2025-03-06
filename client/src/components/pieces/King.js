export const King = {
  isValidMove: (pieces, oldRow, oldCol, newRow, newCol, turn) => {
    if (pieces[newRow][newCol]) {
      if (pieces[newRow][newCol][0] === turn) {
        return false;
      }
    }
    if (Math.abs(newRow - oldRow) <= 1 && Math.abs(newCol - oldCol) <= 1) {
      return true;
    } else {
      return false;
    }
  },
};
