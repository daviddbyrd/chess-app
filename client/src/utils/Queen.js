import { Bishop } from "./Bishop";
import { Rook } from "./Rook";

export const Queen = {
  isValidMove: (...args) => {
    return Bishop.isValidMove(...args) || Rook.isValidMove(...args);
  },
};
