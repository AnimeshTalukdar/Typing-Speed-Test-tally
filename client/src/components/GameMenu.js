import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
const GameMenu = () => {
    const navigate = useNavigate();
    const [numberOfGames, setNumberOfGames] = useState(0);
    const [averageWPM, setAverageWPM] = useState(0);
    useEffect(() => {
        fetchGames();
        fetchAverageWPM();
    }, []);
    const fetchGames = async () => {
        try {
            const response = await axios.get('http://localhost:3001/game-played');
            setNumberOfGames(response.data.count);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchAverageWPM = async () => {
        try {
            const response = await axios.get('http://localhost:3001/average-typing-speed');
            setAverageWPM(response.data.averageWPM.toFixed(2));
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className="flex flex-col justify-center items-center dark:bg-black">
                <h1 className="text-blue-500 text-md justify-center items-center dark:text-red-100">{numberOfGames} Contests Played on Our Platform</h1>
                <h1 className="text-blue-500 text-md justify-center items-center dark:text-red-100 mb-4">{averageWPM} WPM is the Global Typing Speed, What's Yours?</h1>
            </div>
            <div className="rounded-lg shadow-2xl p-10 w-full flex flex-col h-full justify-center items-center dark:shadow-white dark:bg-black">

                <h1 className="text-blue-800 text-4xl justify-center items-center dark:text-red-100">Test Your Typing Speed</h1>
                <div className="flex m-10 justify-between">
                    <button
                        type="button"
                        onClick={() => navigate("/game/create")}
                        className="bg-blue-900 hover:bg-blue-600 hover:cursor-pointer rounded-md text-white p-5 shadow-lg m-2"
                    >
                        Create Game
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/game/join")}
                        className="bg-blue-900 hover:bg-blue-600 hover:cursor-pointer rounded-md text-white p-5 shadow-lg m-2"
                    >
                        Join Game
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/game/compete')}
                        className="bg-blue-900 hover:bg-blue-600 hover:cursor-pointer rounded-md text-white p-5 shadow-lg m-2"
                    >
                        Compete
                    </button>
                </div>
            </div>
        </>



    )
}

export default GameMenu;
