import React, { useState } from "react";
import socket from "../socketConfig";

const CreateGame = (props) => {
  const [nickName, setNickName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const onChange = (e) => {
    setNickName(e.target.value);
  };
  const onChangeDifficulty = (e) => {
    setDifficulty(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    socket.emit("create-game", { nickName, difficulty });
  };

  return (
    <div className="grid justify-center items-center gap-5 p-10 rounded-lg shadow-2xl dark:shadow-white">
      <h1 className="text-blue-800 text-4xl my-5 dark:text-blue-200">Create Game</h1>
      <form onSubmit={onSubmit}>
        <label
          htmlFor="nickName"
          className="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
        >
          Enter Nick Name
        </label>
        <input
          type="text"
          name="nickName"
          value={nickName}
          onChange={onChange}
          placeholder="Enter Nick Name"
          className="shadow appearance-none border rounded w-full mt-2 mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <label
          htmlFor="difficulty"
          className="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
        >
          Select Difficulty
        </label>
        <select
          name="difficulty"
          value={difficulty}
          onChange={onChangeDifficulty}
          className="shadow appearance-none border rounded w-full mt-2 mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button
          style={{ cursor: "pointer" }}
          type="submit"
          className="bg-blue-900 hover:bg-blue-600 hover:cursor-pointer rounded-md text-white p-2 my-5 shadow-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateGame;
