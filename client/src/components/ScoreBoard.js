import React from "react";

const getScoreboard = (players) => {
  const scoreBoard = players.filter((player) => player.WPM !== -1);
  return scoreBoard.sort((a, b) =>
    a.WPM > b.WPM ? -1 : b.WPM > a.WPM ? 1 : 0
  );
};

const ScoreBoard = ({ players }) => {
  const scoreBoard = getScoreboard(players);
  if (scoreBoard.length === 0) return null;
  return (
    <div className="grid justify-center items-center gap-2 my-5">
      <h1 className="text-xl font-bold dark:text-white">Leaderboard</h1>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Rank
            </th>
            <th scope="col" className="px-6 py-3">
              Username
            </th>
            <th scope="col" className="px-6 py-3">
              Speed(WPM)
            </th>
          </tr>
        </thead>
        <tbody>
          {scoreBoard.map((player, index) => {
            return (
              <tr className="bg-white border-b  hover:bg-gray-50">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {index + 1}
                </th>
                <td className="px-6 py-4">{player.nickName}</td>
                <td className="px-6 py-4">{player.WPM}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreBoard;
