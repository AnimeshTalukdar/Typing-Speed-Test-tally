import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CountDown from './CountDown';
import StartBtn from './StartBtn';
import socket from '../socketConfig';
import DisplayWords from './DisplayWords';
import Form from './Form';
import ProgressBar from './ProgressBar';
import ScoreBoard from './ScoreBoard';
import DisplayGameCode from './DisplayGameCode';

const findPlayer = players => {
  return players.find(player => player.socketID === socket.id);
}

const TypeRacer = ({ gameState, onQuitGame, gameIsQuit }) => {
  const {_id, players, words, isOpen, isOver} = gameState;
  const player = findPlayer(players);
  const navigate = useNavigate();
  const handleQuitGame = () => {
    // Add your logic here to handle the "Quit" event
    onQuitGame(); // Call the callback function from the parent to update the game state
    console.log("User has quit the game.");
    
  };
  if (_id === "") {
    navigate("/"); // Redirect to the home page if _id is not available
    return null; // Returning null temporarily until the redirection takes effect
  }

  return (
    <div className='text-center'>
      <DisplayWords words={words} player={player} />
      <ProgressBar players={players} player={player} wordsLength={words.length} />
      <Form isOpen={isOpen} isOver={isOver} gameID={_id} onQuitGame={handleQuitGame} isDisabled={gameIsQuit} />
      <CountDown />
      <StartBtn player={player} gameID={_id} />
      { isOpen ? <DisplayGameCode gameID={_id} /> : null}
      <ScoreBoard players={players} />
    </div>
  );
}

export default TypeRacer;
