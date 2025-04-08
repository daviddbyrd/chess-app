const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const { Chess } = require("chess.js");

let games = {};

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("createGame", () => {
    const key = Math.random().toString(36).substring(2, 6);
    games[key] = {
      players: {
        [socket.id]: { colour: "w" },
      },
      board: new Chess(),
      creator: socket.id,
    };
    socket.join(key);
    socket.emit("gameCreated", { key });
  });

  socket.on("joinGame", (key) => {
    if (games[key]) {
      games[key].players[socket.id] = {
        colour: "b",
      };
      socket.join(key);
      io.to(games[key].creator).emit("startGame", {
        key,
        colour: "w",
        initialGame: games[key].board.fen(),
      });
      io.to(socket.id).emit("startGame", {
        key,
        colour: "b",
        initialGame: games[key].board.fen(),
      });
    } else {
      socket.emit("error", "Invalid key or full game");
    }
  });

  socket.on("checkMove", ({ key, sourceSquare, targetSquare }) => {
    if (games[key].players[socket.id].colour != games[key].board.turn()) {
      console.log("hello");
      console.log(`player id: ${games[key].players[socket.id].colour}`);
      console.log(`board turn: ${games[key].board.turn()}`);
      io.to(key).emit("moveMade", {
        success: false,
        newGame: games[key].board,
      });
      return;
    }
    try {
      let result = games[key].board.move({
        from: sourceSquare,
        to: targetSquare,
      });
      io.to(key).emit("moveMade", {
        success: true,
        newGame: games[key].board.fen(),
        captured: result.captured,
      });
    } catch (error) {
      io.to(key).emit("moveMade", {
        success: false,
        newGame: games[key].board.fen(),
      });
    }
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));
