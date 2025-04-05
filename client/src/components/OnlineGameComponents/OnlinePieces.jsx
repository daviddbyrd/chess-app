import { useState, useEffect, useRef } from "react";
import socket from "../../utils/socket.js";
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

const OnlinePieces = () => {
  const [pieces, setPieces] = useState(defaultPieces);
  const piecesRef = useRef(pieces);
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
  const captureSound = new Audio(CaptureSoundEffect);
  const moveSound = new Audio(MoveSoundEffect);
  const [keyQuery, setKeyQuery] = useState("");
  const [gameKey, setGameKey] = useState(null);
  const [playerColour, setPlayerColour] = useState(null);
  const playerColourRef = useRef(playerColour);

  const movePiece = (oldRow, oldCol, newRow, newCol, playerMove) => {
    if (
      !playerMove ||
      (!promoting &&
        isValidMove(
          piecesRef.current,
          oldRow,
          oldCol,
          newRow,
          newCol,
          currentTurn,
          castlingAvailability,
          enPassantAvailability
        ))
    ) {
      console.log(`HERE WE GO AGAIN ${oldRow}, ${oldCol} ${piecesRef.current}`);
      if (playerMove && pieces[oldRow][oldCol][0] !== playerColour) {
        setCurrentPiece(null);
        console.log("Failed here");
        return;
      }
      if ("kr".includes(piecesRef.current[oldRow][oldCol][1])) {
        let changedIndices = convertCastlingAvailability(
          piecesRef.current[oldRow][oldCol],
          oldCol
        );

        setCastlingAvailability((prev) => {
          changedIndices.forEach((i) => {
            prev[i] = "";
          });
          return prev;
        });
      }

      if (
        isEnPassantTarget(piecesRef.current, oldRow, oldCol, newRow, newCol)
      ) {
        setEnPassantAvailabillity(`${newCol}${newRow}`);
      } else {
        setEnPassantAvailabillity(null);
      }

      const takenPiece = findTakenPiece(
        piecesRef.current,
        oldRow,
        oldCol,
        newRow,
        newCol,
        currentTurn
      );
      if (takenPiece) {
        captureSound.play();

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
      }
      const nextPieces = constructBoard(
        piecesRef.current,
        oldRow,
        oldCol,
        newRow,
        newCol
      );
      setPieces(nextPieces);
      console.log(nextPieces);
      if (isPromoting(nextPieces)) {
        setPromoting({ row: newRow, col: newCol });
      } else {
        if (currentTurn === "b") {
          setCurrentTurn("w");
          console.log(1);
        } else {
          setCurrentTurn("b");
          console.log(2);
        }
      }
      if (playerMove) {
        sendMove(oldRow, oldCol, newRow, newCol);
        console.log(`HERE WE GO AGAIN ${oldRow}, ${oldCol} inner`);
      }
    }
    console.log("main function failed");
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
      movePiece(currentPiece.row, currentPiece.col, row, col, true);
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
      movePiece(row, col, newRow, newCol, true);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handlePromotionClick = async (row, col, piece) => {
    const nextPieces = constructBoardPromotion(pieces, row, col, piece);
    setPieces(nextPieces);
    setPromoting(false);
    if (currentTurn === "b") {
      setCurrentTurn("w");
      console.log(3);
    } else {
      setCurrentTurn("b");
      console.log(4);
    }
  };

  const rematch = () => {
    setPieces(defaultPieces);
    setGamestate(null);
    setCurrentTurn("w");
  };

  useEffect(() => {
    console.log(`Updated playerColour: ${playerColour}`);
  }, [playerColour]);

  useEffect(() => {
    socket.on("gameCreated", (key) => {
      setGameKey(key);
      console.log(key);
    });

    socket.on("startGame", ({ key, colour }) => {
      console.log("GameStarted");
      setGameKey(key);
      setPlayerColour(colour);
      console.log(`colour: ${colour}`);
    });

    socket.on("moveMade", ({ oldRow, oldCol, newRow, newCol, turn }) => {
      console.log(`move made called ${oldRow} ${oldCol}`);
      updateState(oldRow, oldCol, newRow, newCol, turn);
    });
  }, []);

  const createGame = () => {
    socket.emit("createGame");
  };

  const joinGame = () => {
    socket.emit("joinGame", keyQuery);
    console.log(keyQuery);
  };

  useEffect(() => {
    piecesRef.current = pieces;
  }, [pieces]);

  useEffect(() => {
    playerColourRef.current = playerColour;
  }, [playerColour]);

  const updateState = (oldRow, oldCol, newRow, newCol, turn) => {
    if (playerColourRef.current !== turn) {
      console.log(
        `update state success, turn: ${turn}, playerColourRef: ${playerColourRef.current}`
      );
      movePiece(oldRow, oldCol, newRow, newCol, false);
      setCurrentTurn(playerColourRef.current);
    } else {
      console.log(
        `update state failed, turn: ${turn}, playerColourRef: ${playerColourRef.current}`
      );
    }
  };

  const sendMove = (oldRow, oldCol, newRow, newCol) => {
    console.log(`Send move called ${oldRow} ${oldCol}`);
    console.log(`playerColour: ${playerColour}, gameKey: ${gameKey}`);
    socket.emit("changeState", {
      key: gameKey,
      oldRow,
      oldCol,
      newRow,
      newCol,
      turn: playerColour,
    });
  };

  return (
    <>
      <div>
        <button
          className="w-90 h-7 bg-red-400 m-4 rounded-lg cursor-grab bg-white shadow-md"
          onClick={() => createGame()}
        >
          <h1 className="text-gray text-lg">Create Game</h1>
        </button>
        {gameKey && gameKey}
        <div>
          <input
            value={keyQuery}
            placeholder="Enter Key"
            onChange={(e) => setKeyQuery(e.target.value)}
            className="w-40 h-7 bg-red-400 m-4 rounded-lg bg-white shadow-md text-lg pl-4 caret-black"
          />
          <button
            className="w-40 h-7 bg-red-400 m-4 rounded-lg cursor-grab bg-white shadow-md"
            onClick={() => joinGame(keyQuery)}
          >
            <h1 className="text-gray text-lg">Join Game</h1>
          </button>
        </div>
      </div>
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

export default OnlinePieces;
