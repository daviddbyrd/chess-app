import { useState, useEffect, useRef } from "react";
import Piece from "./Piece.jsx";
import PromotionMenu from "./PromotionMenu.jsx";
import EndPage from "./EndPage.jsx";
import {
  isValidMove,
  isCheckmate,
  constructBoard,
  constructBoardPromotion,
  isPromoting,
  getSquareSize,
  isStalemate,
  findTakenPiece,
} from "../utils/Helper.js";
import { defaultPieces } from "../utils/DefaultPieces.js";

const Pieces = () => {
  const [pieces, setPieces] = useState(defaultPieces);
  const boardRef = useRef(null);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("w");
  const [moved, setMoved] = useState(new Set());
  const [prevMove, setPrevMove] = useState(null);
  const [promoting, setPromoting] = useState(false);
  const [gamestate, setGamestate] = useState(null);
  const [takenPieces, setTakenPieces] = useState({
    b: [],
    w: [],
  });

  const movePiece = (oldRow, oldCol, newRow, newCol) => {
    if (
      !promoting &&
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
      const takenPiece = findTakenPiece(
        pieces,
        oldRow,
        oldCol,
        newRow,
        newCol,
        currentTurn
      );
      if (takenPiece) {
        let colour = takenPiece[0];
        setTakenPieces((prev) => ({ ...prev, [colour]: [...prev[colour]] }));
      }
      const nextPieces = constructBoard(pieces, oldRow, oldCol, newRow, newCol);
      setPieces(nextPieces);
      setPrevMove(`${oldRow}${oldCol}${newRow}${newCol}`);
      console.log(takenPieces.b);
      console.log(takenPiece);
      console.log(oldCol);
      console.log(newCol);
      if (isPromoting(nextPieces)) {
        setPromoting({ row: newRow, col: newCol });
        console.log("ispromoting");
      } else {
        if (currentTurn === "b") {
          setCurrentTurn("w");
        } else {
          setCurrentTurn("b");
        }
      }
    }
    setCurrentPiece(null);
  };

  useEffect(() => {
    if (isCheckmate(pieces, currentTurn)) {
      setGamestate("checkmate");
    } else if (isStalemate(pieces, currentTurn)) {
      setGamestate("stalemate");
    }
  }, [currentTurn]);

  const handleClick = (row, col, piece) => {
    if (currentPiece && !promoting) {
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

  const handlePromotionClick = (row, col, piece) => {
    const nextPieces = constructBoardPromotion(pieces, row, col, piece);
    setPieces(nextPieces);
    setPromoting(false);
    if (currentTurn === "b") {
      setCurrentTurn("w");
    } else {
      setCurrentTurn("b");
    }
  };

  const rematch = () => {
    setPieces(defaultPieces);
    setGamestate(null);
    setCurrentTurn("w");
  };

  return (
    <>
      {takenPieces.b.map((piece, i) => (
        <Piece
          key={`${rowIndex}-${colIndex}`}
          row={rowIndex}
          col={colIndex}
          piece={piece}
          handleClick={handleClick}
          className="w-5 h-5"
        ></Piece>
      ))}
      <div
        ref={boardRef}
        className="grid grid-cols-8 absolute w-8/10 top-1/10 left-1/10"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {gamestate !== null && (
          <EndPage state={gamestate} turn={currentTurn} rematch={rematch} />
        )}
        {promoting !== false && (
          <PromotionMenu
            row={promoting.row}
            col={promoting.col}
            turn={currentTurn}
            width={getSquareSize(boardRef)}
            handlePromotionClick={handlePromotionClick}
          />
        )}
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
      <div className="grid grid-rows-1 absolute w-1/10 t-1/10">
        {takenPieces.b}
        {takenPieces.b.map((piece, i) => (
          <Piece
            key={`${i}`}
            row={rowIndex}
            col={colIndex}
            piece={piece}
            handleClick={handleClick}
            className="w-5 h-5"
          ></Piece>
        ))}
      </div>
    </>
  );
};

export default Pieces;
