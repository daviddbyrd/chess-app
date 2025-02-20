import Square from "./Square.jsx";

const Board = () => {
  const rows = 8;
  const cols = 8;

  return (
    <div className="grid grid-cols-8 absolute top-0 left-0">
      {Array.from({ length: rows }).map((_, rowIndex) =>
        Array.from({ length: cols }).map((_, colIndex) => (
          <Square row={rowIndex} col={colIndex} />
        ))
      )}
    </div>
  );
};

export default Board;
