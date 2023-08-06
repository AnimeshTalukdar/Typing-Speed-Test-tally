import React, { useState, useRef, useEffect } from "react";
import socket from "../socketConfig";
import { useNavigate } from 'react-router-dom';

const Form = ({ isOpen, isOver, gameID, onQuitGame }) => {
    const navigate = useNavigate();
    const [userInput, setUserInput] = useState("");
    const [isDisabled, setIsDisabled] = useState(false); // Track if the form is disabled
    const textInput = useRef(null);
    
    useEffect(() => {
        if (!isOpen) {
            textInput.current.focus();
        }
    }, [isOpen]);

    const resetForm = () => {
        setUserInput("");
    };
    const handleKeyDown = (e) => {
        const letter = e.key;
        
        // Send the letter to the server
        socket.emit("userInput", { userInput: letter, gameID });
        
        // Reset the form
        setUserInput("");
    };

    
    const handleQuitGame = () => {
        // Disable the form when the user quits the game
        setIsDisabled(true); 
        socket.emit("quitGame", { gameID });
    };
    return (
        <>
            <form className="my-4">
                <input
                    type="text"
                    readOnly={isOpen || isOver || isDisabled} // Disable the input when the form is disabled
                    onKeyDown={handleKeyDown}
                    value={userInput}
                    className={`shadow appearance-none border rounded w-1/2 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isDisabled ? "bg-gray-300" : ""}`} // Add a different background color to indicate it's disabled
                    ref={textInput}
                    placeholder="start typing here"
                />
            </form>
            {!isOpen && !isOver && (
                <button onClick={handleQuitGame} className="bg-red-500 text-white px-4 py-2 rounded-md my-3">
                    Quit
                </button>
            )}
        </>
    );
};

export default Form;
