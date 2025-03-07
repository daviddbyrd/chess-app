export const Knight = {
  isValidMove: (pieces, oldRow, oldCol, newRow, newCol, turn) => {
    if (pieces[newRow][newCol]) {
      if (pieces[newRow][newCol][0] === turn) {
        return false;
      }
    }
    if (
      (Math.abs(newRow - oldRow) === 2 && Math.abs(newCol - oldCol) === 1) ||
      (Math.abs(newRow - oldRow) === 1 && Math.abs(newCol - oldCol) === 2)
    ) {
      return true;
    } else {
      return false;
    }
  },

  canStopCheckmate: (pieces, oldRow, oldCol, turn) => {
    moves = [
      (2, 1),
      (2, -1),
      (1, 2),
      (1, -2),
      (-2, 1),
      (-2, -1),
      (-1, 2),
      (-1, -2),
    ];
    for (let i = 0; i < moves.length; ++i) {
      let rdif = moves[i][0];
      let cdif = moves[i][1];
      let newRow = oldRow + rdif;
      let newCol = oldCol + cdif;

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
    }
    return false;
  },
};
