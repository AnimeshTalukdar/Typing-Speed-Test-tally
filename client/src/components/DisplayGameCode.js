import React, { useRef, useState } from "react";

const DisplayGameCode = ({ gameID }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const textInputRef = useRef(null);

  const copyToClipboard = (e) => {
    textInputRef.current.select();
    document.execCommand("copy");
    setCopySuccess(true);
  };

  return (
    <div className="grid justify-center items-center gap-5 rounded-lg shadow-lg my-4 p-5 dark:shadow-white">
      <h4 className="text-blue-800 text-lg dark:text-white">
        Share This Code With Your Friends To Let Them Join The Race.
      </h4>
      <div className="flex items-center gap-2">
        <input
          type="text"
          ref={textInputRef}
          value={gameID}
          readOnly
          className="shadow appearance-none  border rounded w-2/3 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <div className="input-group-append">
          <button
            className="bg-blue-900 hover:bg-blue-600 hover:cursor-pointer rounded-md text-sm text-white p-2 my-5 shadow-lg dark:text-white"
            onClick={copyToClipboard}
            type="button"
          >
            Copy
          </button>
        </div>
      </div>
      {copySuccess ? (
        <div role="alert" className="dark:text-white">
          Copied Successfully!!!
        </div>
      ) : null}
    </div>
  );
};

export default DisplayGameCode;
