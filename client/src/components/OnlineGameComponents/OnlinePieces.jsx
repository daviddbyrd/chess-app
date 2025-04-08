import { useState, useEffect, useRef } from "react";
import socket from "../../utils/socket.js";
import { Chessboard } from "react-chessboard";
import MoveSoundEffect from "../../assets/move.mp3";
import CaptureSoundEffect from "../../assets/capture.mp3";

const OnlinePieces = () => {
  const [game, setGame] = useState(null);
  const [gameKey, setGameKey] = useState();
  const [keyQuery, setKeyQuery] = useState("");
  const [playerColour, setPlayerColour] = useState();
  const captureSound = new Audio(CaptureSoundEffect);
  const moveSound = new Audio(MoveSoundEffect);

  useEffect(() => {
    socket.on("gameCreated", ({ key, colour, initialGame }) => {
      setGameKey(key);
      setPlayerColour(colour);
      setGame(initialGame);
    });

    socket.on("startGame", ({ key, colour, initialGame }) => {
      setGameKey(key);
      setPlayerColour(colour);
      setGame(initialGame);
    });

    socket.on("moveMade", ({ success, newGame, captured }) => {
      if (success) {
        setGame(newGame);
        if (captured) {
          captureSound.play();
        } else {
          moveSound.play();
        }
      }
    });
  }, []);

  const createGame = () => {
    socket.emit("createGame");
  };

  const joinGame = () => {
    socket.emit("joinGame", keyQuery);
  };

  const sendMove = (sourceSquare, targetSquare) => {
    socket.emit("checkMove", {
      key: gameKey,
      sourceSquare,
      targetSquare,
      playerColour,
    });
  };

  const onDrop = (sourceSquare, targetSquare) => {
    sendMove(sourceSquare, targetSquare);
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
        {gameKey && <h1>{gameKey}</h1>}
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
      {game && (
        <div className="h-130 w-130 relative">
          <Chessboard
            position={game}
            onPieceDrop={onDrop}
            autoPromoteToQueen={true}
            animationDuration={0}
          />
        </div>
      )}
    </>
  );
};

export default OnlinePieces;
