import Square from "./Square.jsx";
import Pieces from "./Pieces.jsx";

const Board = () => {
  const rows = 8;
  const cols = 8;

  return (
    <div className="grid grid-cols-8 absolute w-8/10 border-4 border-white inset-0 m-auto w-8/10 h-8/10">
      {Array.from({ length: rows }).map((_, rowIndex) =>
        Array.from({ length: cols }).map((_, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
          />
        ))
      )}
    </div>
  );
};

export default Board;
