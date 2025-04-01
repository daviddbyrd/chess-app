const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let games = {};

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("createGame", () => {
    const key = Math.random().toString(36).substring(2, 6);
    games[key] = { players: [socket.id], state: null };
    socket.join(key);
    socket.emit("game created", key);
  });

  socket.on("joinGame", (key) => {
    if (games[key] && games[key].players.length === 1) {
      games[key].players.push(socket.id);
      socket.join(key);
      io.to(key).emit("startGame", { key });
    } else {
      socket.emit("error", "Invalid key or full game");
    }
  });

  socket.on("makeMove", ({ key, move }) => {
    io.to(key).emit("moveMade", move);
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));
