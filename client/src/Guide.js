import React from 'react'

function Guide() {
    return (
        <div className="rounded-lg shadow-2xl p-10 w-full flex flex-col h-full justify-center  dark:shadow-white dark:bg-black dark:text-white">
            <p>This Game has 3 Modes:</p>
            <p>1.Practice/Solo Mode - A game mode for player to practice and improve their typing skills. It can be started by clicking on the Create Game option!</p>
            <p>2.Private Lobby Mode - In this mode the players are able to join the link shared by their friends and compete with their friends in private. It can be started by clicking on the Join Game option!</p>
            <p>3.Multiplayer Mode - In this mode players can compete with other random players globally and players are selected on basis of difficulty choosen. It can started by clicking Compete option!</p>
        </div>
    )
}

export default Guide;