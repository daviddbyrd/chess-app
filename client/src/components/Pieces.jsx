import { useState, useEffect } from "react";
import Piece from "./Piece.jsx";
import { isValidMove, isCheckmate, constructBoard } from "../utils/Helper.js";

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
  const [moved, setMoved] = useState(new Set());
  const [prevMove, setPrevMove] = useState(null);

  const movePiece = (oldRow, oldCol, newRow, newCol) => {
    if (
      isValidMove(
        pieces,
        oldRow,
        oldCol,
        newRow,
        newCol,
        currentTurn,
        moved,
        prevMove
      )
    ) {
      if ("kr".includes(pieces[oldRow][oldCol][1])) {
        let code = `${oldRow}${pieces[oldRow][oldCol]}`;
        if (!moved.has(code)) {
          setMoved((prevMoved) => prevMoved.add(code));
        }
      }
      const nextPieces = constructBoard(pieces, oldRow, oldCol, newRow, newCol);
      setPieces(nextPieces);
      setPrevMove(`${oldRow}${oldCol}${newRow}${newCol}`);

      if (currentTurn === "b") {
        setCurrentTurn("w");
      } else {
        setCurrentTurn("b");
      }
    }
    setCurrentPiece(null);
  };

  useEffect(() => {
    if (isCheckmate(pieces, currentTurn)) {
      console.log("checkmate");
      setCheckmate(true);
    }
  }, [currentTurn]);

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
    let row = parseInt(data[2]);
    let col = parseInt(data[3]);
    if (0 <= newRow && newRow < 8 && 0 <= newCol && newCol < 8) {
      movePiece(row, col, newRow, newCol);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <>
      {promoting && <PromotionMenu row={promoting.row} col={promoting.col} />}
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
    </>
  );
};

export default Pieces;
