import { useState } from "react";
import Piece from "./Piece.jsx";
import { isValidMove } from "../utils/Helper.js";

const Pieces = () => {
  const [pieces, setPieces] = useState([
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
  ]);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("w");

  const movePiece = (oldRow, oldCol, newRow, newCol) => {
    if (isValidMove(pieces, oldRow, oldCol, newRow, newCol, currentTurn)) {
      const newPiece = pieces[oldRow][oldCol];
      const nextPieces = pieces.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          if (rowIndex === oldRow && colIndex === oldCol) {
            return null;
          } else if (rowIndex === newRow && colIndex === newCol) {
            return newPiece;
          } else {
            return piece;
          }
        })
      );
      setPieces(nextPieces);
      console.log(nextPieces);
      if (currentTurn === "b") {
        setCurrentTurn("w");
      } else {
        setCurrentTurn("b");
      }
    }
    setCurrentPiece(null);
  };

  const handleClick = (row, col, piece) => {
    if (currentPiece) {
      movePiece(currentPiece.row, currentPiece.col, row, col);
    } else {
      if (piece) {
        setCurrentPiece({ row, col, piece });
      }
    }
  };

  const handleDrop = (e) => {
    let board = e.currentTarget.getBoundingClientRect();
    let rowDist = e.clientY - board.top;
    let colDist = e.clientX - board.left;

    let rowHeight = board.height / 8;
    let colWidth = board.width / 8;

    let newRow = 7 - Math.floor(rowDist / rowHeight);
    let newCol = Math.floor(colDist / colWidth);

    let data = e.dataTransfer.getData("text/plain");
    console.log(data);
    let row = data[2];
    let col = data[3];

    movePiece(row, col, newRow, newCol);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      className="grid grid-cols-8 absolute"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {pieces.toReversed().map((row, reversedIndex) => {
        const rowIndex = 7 - reversedIndex;
        return row.map((piece, colIndex) => (
          <Piece
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            piece={piece}
            handleClick={handleClick}
          />
        ));
      })}
    </div>
  );
};

export default Pieces;
