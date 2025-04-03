import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnlinePieces from "../components/OnlineGameComponents/OnlinePieces";

const OnlineGame = () => {
  const navigate = useNavigate();
  const [keyQuery, setKeyQuery] = useState("");

  return (
    <div className="flex items-center justify-center h-screen w-screen  bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 backdrop-blur">
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl"></div>
      <div className="absolute -right-20 bottom-40 h-80 w-80 rounded-full bg-purple-100/30 blur-3xl"></div>
      <div className="absolute bottom-10 left-40 h-80 w-80 rounded-full bg-pink-100/30 blur-3xl"></div>
      <div className="flex flex-col items-center justify-center h-screen">
        <OnlinePieces />
      </div>
    </div>
    // <div className="flex items-center justify-center h-screen w-screen  bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 backdrop-blur">
    //   <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl"></div>
    //   <div className="absolute -right-20 bottom-40 h-80 w-80 rounded-full bg-purple-100/30 blur-3xl"></div>
    //   <div className="absolute bottom-10 left-40 h-80 w-80 rounded-full bg-pink-100/30 blur-3xl"></div>
    //   <div className="flex flex-col items-center justify-center h-100 w-170 bg-white/50 rounded-3xl shadow-lg backdrop-blur-xl">
    //     <button className="w-90 h-15 bg-red-400 m-4 rounded-lg cursor-grab bg-white shadow-md">
    //       <h1 className="text-gray text-lg">Create Game</h1>
    //     </button>
    //     <div>
    //       <input
    //         value={keyQuery}
    //         placeholder="Enter Key"
    //         onChange={(e) => setKeyQuery(e.target.value)}
    //         className="w-40 h-15 bg-red-400 m-4 rounded-lg bg-white shadow-md text-lg pl-4 caret-black"
    //       />
    //       <button
    //         onClick={() => navigate(gameType.path)}
    //         className="w-40 h-15 bg-red-400 m-4 rounded-lg cursor-grab bg-white shadow-md"
    //       >
    //         <h1 className="text-gray text-lg">Join Game</h1>
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default OnlineGame;
