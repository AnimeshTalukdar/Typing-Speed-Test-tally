import React, { useState } from "react";
import socket from "../socketConfig";

const StartBtn = ({ player, gameID }) => {
  const [showBtn, setShowBtn] = useState(true);
  const { isPartyLeader } = player;

  const onClickHandler = (e) => {
    socket.emit("timer", { playerID: player._id, gameID });
    setShowBtn(false);
  };

  return isPartyLeader && showBtn ? (
    <button
      type="button"
      onClick={onClickHandler}
      className="bg-blue-900 hover:bg-blue-600 hover:cursor-pointer rounded-md text-white p-2 my-2 shadow-lg dark:shadow-white"
    >
      Start Game
    </button>
  ) : null;
};

export default StartBtn;
