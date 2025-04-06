const { chess } = require("chess.js");

export const makeMove = ({ board, move }) => {
  const result = board.move(move);
  return result;
};
