import { useState, useEffect, useRef } from "react";
import Piece from "../Piece.jsx";
import PieceIcon from "../PieceIcon.jsx";
import PromotionMenu from "../PromotionMenu.jsx";
import EndPage from "../EndPage.jsx";
import {
  isValidMove,
  isCheckmate,
  constructBoard,
  constructBoardPromotion,
  isPromoting,
  getSquareSize,
  isStalemate,
  findTakenPiece,
  convertCastlingAvailability,
  isEnPassantTarget,
} from "../../utils/Helper.js";
import { defaultPieces } from "../../utils/DefaultPieces.js";
import Board from "../Board.jsx";
import MoveSoundEffect from "../../assets/move.mp3";
import CaptureSoundEffect from "../../assets/capture.mp3";

const LocalPieces = () => {
  const [pieces, setPieces] = useState(defaultPieces);
  const boardRef = useRef(null);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("w");
  const [castlingAvailability, setCastlingAvailability] = useState([
    "K",
    "Q",
    "k",
    "q",
  ]);
  const [enPassantAvailability, setEnPassantAvailabillity] = useState(null);
  const [promoting, setPromoting] = useState(false);
  const [gamestate, setGamestate] = useState(null);
  const [takenPieces, setTakenPieces] = useState({
    b: [],
    w: [],
  });
  const [turnCount, setTurnCount] = useState(1);
  const [halfMoveClock, setHalfMoveClock] = useState(0);
  const captureSound = new Audio(CaptureSoundEffect);
  const moveSound = new Audio(MoveSoundEffect);

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
        castlingAvailability,
        enPassantAvailability
      )
    ) {
      // if (pieces[oldRow][oldCol][0] !== playerColour) {
      //   setCurrentPiece(null);
      //   return;
      // }

      if ("kr".includes(pieces[oldRow][oldCol][1])) {
        let changedIndices = convertCastlingAvailability(
          pieces[oldRow][oldCol],
          oldCol
        );

        setCastlingAvailability((prev) => {
          changedIndices.forEach((i) => {
            prev[i] = "";
          });
          return prev;
        });
      }

      if (isEnPassantTarget(pieces, oldRow, oldCol, newRow, newCol)) {
        setEnPassantAvailabillity(`${newCol}${newRow}`);
      } else {
        setEnPassantAvailabillity(null);
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
        captureSound.play();

        setHalfMoveClock(0);

        let colour = takenPiece[0];
        setTakenPieces((prev) => {
          const newTakenPieces = [...prev[colour], takenPiece];
          newTakenPieces.sort((a, b) => a - b);
          return {
            ...prev,
            [colour]: newTakenPieces,
          };
        });
      } else {
        moveSound.play();

        if (pieces[oldRow][oldCol][1] !== "p") {
          setHalfMoveClock((prev) => prev + 1);
        } else {
          setHalfMoveClock(0);
        }
      }
      const nextPieces = constructBoard(pieces, oldRow, oldCol, newRow, newCol);
      setPieces(nextPieces);
      if (isPromoting(nextPieces)) {
        setPromoting({ row: newRow, col: newCol });
      } else {
        if (currentTurn === "b") {
          setTurnCount((prevTurn) => prevTurn + 1);
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

  const handlePromotionClick = async (row, col, piece) => {
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
      <div className="relative w-full">
        <div className="grid grid-flow-col h-10 justify-start">
          {takenPieces.w.map((piece, i) => (
            <PieceIcon key={`${i}`} piece={piece}></PieceIcon>
          ))}
        </div>
      </div>
      <div className="h-130 w-130 relative border-white/80 border-10">
        <Board />
        <div
          ref={boardRef}
          className="grid grid-cols-8 w-full absolute inset-0"
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
      </div>
      <div className="relative w-full">
        <div className="grid grid-flow-col h-10 justify-start">
          {takenPieces.b.map((piece, i) => (
            <PieceIcon key={`${i}`} piece={piece}></PieceIcon>
          ))}
        </div>
      </div>
    </>
  );
};

export default LocalPieces;
