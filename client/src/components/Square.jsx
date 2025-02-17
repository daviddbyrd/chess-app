import React from "react";
import bbi from "../assets/bb.png";
import bki from "bk.png";
import bni from "bn.png";
import bpi from "bp.png";
import bqi from "bq.png";
import bri from "br.png";
import wbi from "wb.png";
import wki from "wk.png";
import wni from "wn.png";
import wpi from "wp.png";
import wqi from "wq.png";
import wri from "wr.png";


const Square = ({ row, col, piece }) => {
  return (
    <div
      className={`w-20 h-20 ${
        (row + col) % 2 === 0 ? "bg-green-300" : "bg-stone-300"
      }`}
    >
      {piece && <img className="w-20 h-20" src={`${piece}i`} />}
      {row}
      {String.fromCharCode(col + 97)}
    </div>
  );
};

export default Square;
