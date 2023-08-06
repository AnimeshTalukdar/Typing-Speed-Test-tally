import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
  useNavigate,
} from "react-router-dom";
import GameMenu from "./components/GameMenu";
import CreateGame from "./components/CreateGame";
import JoinGame from "./components/JoinGame";
import socket from "./socketConfig";
import TypeRacer from "./components/TypeRacer";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Compete from "./components/Compete.js";
import styles from "./index.css";
import Guide from './Guide'
const initial={
  _id: "",
  isOpen: false,
  players: [],
  words: [],
};
// import OpenGame from "./components/Compete";
function App() {
  const [gameState, setGameState] = useState(initial);
  const [gameIsQuit, setGameIsQuit] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("updateGame", (game) => {
      console.log(game);
      setGameState(game);
    });
    

    return () => {
      socket.off("updateGame");
    };
  }, []);

  useEffect(() => {
    if (gameState._id !== "") navigate(`/game/${gameState._id}`);
  }, [gameState._id, navigate]);

  const handleGameQuit = () => {
    setGameState(initial);
    setGameIsQuit(true);
  };
  return (
    <>
      <Header></Header>
      <div className="grid justify-center items-center p-20 dark:bg-black">
        <Routes>
          <Route path="/" element={<GameMenu />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/game/create" element={<CreateGame />} />
          <Route path="/game/compete" element={<Compete />} />
          <Route path="/game/join" element={<JoinGame />} />
          <Route
            path="/game/:gameID"
            element={<TypeRacer gameState={gameState} onQuitGame={handleGameQuit}/>}
          />
          
        </Routes>
      </div>
      <Footer></Footer>
    </>
  );
}

export default App;

