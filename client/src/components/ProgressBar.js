import React from "react";

const calculatePercentage = (player, wordsLength) => {
  if (player.currentWordIndex !== 0) {
    return ((player.currentWordIndex / wordsLength) * 100).toFixed(2);
  }
  return 0;
};
const getSpeedMessage = (WPM) => {
  if (WPM >= 75) {
    return "You're typing like a pro!";
  } else if (WPM >= 60) {
    return "Great typing speed!";
  } else if (WPM >= 45) {
    return "Good progress!";
  } else if (WPM >= 30) {
    return "Keep going!";
  } else if (WPM == -1) {
    return "You haven't Started Yet!";
  }
  else {
    return "You can do better!";
  }
};
const getColor = (WPM) => {
  if (WPM >= 75) {
    return "text-green-800";
  } else if (WPM >= 60) {
    return "text-green-600";
  } else if (WPM >= 45) {
    return "text-blue-600";
  } else if (WPM >= 30) {
    return "text-orange-600";
  } else if (WPM == -1) {
    return "text-red-500";
  }
  else {
    return "text-yellow-500";
  }
};
const getColorByPercentage = (percentage) => {
  if (percentage >= 75) {
    return "bg-green-500"; // Green color for 75% and above
  } else if (percentage >= 50) {
    return "bg-yellow-400";
  }
  else if (percentage >= 25) {
    return "bg-blue-400"; // Yellow color for 50% and above
  } else {
    return "bg-red-400"; // Red color for below 50%
  }
};

const ProgressBar = ({ player, players, wordsLength }) => {
  const percentage = calculatePercentage(player, wordsLength);
  const colorClass = getColorByPercentage(percentage);
  const colorText = getColor(player.WPM);
  const msg = getSpeedMessage(player.WPM);
  
    return (
      <div>
        <h1 className="text-lg font-bold mt-5 mb-3 dark:text-white">
          {player.nickName}
        </h1>
        <span className="text-lg mt-5 mb-3 mr-4 ${colorClass}">
          Your Current Speed:{player.WPM}
        </span>
        <span className={`text-md mt-5 mb-3 dark:text-white ${colorText}`}>
          ({msg})
        </span>
        <div className="w-full bg-gray-200 rounded-full" key={player._id}>
          <div
            className={`text-xs font-medium text-white text-center p-0.5 leading-none rounded-full ${colorClass}`}
            role="progressbar"
            style={{ width: `${percentage}%` }}
          >
            {`${percentage}%`}
          </div>
        </div>

        {players.map((playerObj) => {
          const percentage = calculatePercentage(playerObj, wordsLength);
          const colorClass = getColorByPercentage(percentage);

          return playerObj._id !== player._id ? (
            <div key={playerObj._id}>
              <h1 className="text-lg font-bold mt-5 mb-3 dark:text-white">{playerObj.nickName}</h1>
              <div className="w-full bg-gray-200 rounded-full">
                <div
                  className={`text-xs font-medium text-black text-center p-0.5 leading-none rounded-full ${colorClass}`}
                  role="progressbar"
                  style={{ width: `${percentage}%` }}
                >
                  {`${percentage}%`}
                </div>
              </div>
            </div>
          ) : null;
        })}
      </div>
    );
};

export default ProgressBar;
