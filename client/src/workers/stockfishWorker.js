import stockfish from "stockfish";

const engine = stockfish();

engine.onmessage = (event) => {
  postMessage(event.data);
};

onmessage = (event) => {
  engine.postMessage(event.data);
};
