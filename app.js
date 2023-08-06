const express = require('express');
const app = express();
const socketio = require('socket.io');
const mongoose = require('mongoose');
const expressServer = app.listen(3001);
const io = socketio(expressServer);
const Game = require('./Models/Game');
const QuotableAPI = require('./EasyData');
const router = express.Router();
const cors = require('cors');
let CurGameEasy = null;
let CurGameMedium = null;
let CurGameHard = null;

app.use(cors());
app.use('/', router);
mongoose.connect('mongodb://localhost:27017/typeracerTutorial',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => { console.log('successfully connected to database') });
router.get('/game-played', async (req, res) => {
    try {
        const count = await Game.countDocuments();
        res.json({ count });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const calculateAverageGlobalTypingSpeed = async () => {
    try {
        // Find all games in the database
        const games = await Game.find();

        let totalWPM = 0;
        let totalPlayers = 0;

        // Loop through all games
        games.forEach((game) => {
            // Loop through all players in each game
            game.players.forEach((player) => {
                // Check if the player has a valid WPM (not -1)
                if (player.WPM !== -1) {
                    totalWPM += player.WPM;
                    totalPlayers++;
                }
            });
        });

        // Calculate the average WPM
        const averageWPM = totalWPM / totalPlayers;

        return averageWPM;
    } catch (err) {
        throw new Error(err.message);
    }
};
router.get('/average-typing-speed', async (req, res) => {
    try {
        const averageWPM = await calculateAverageGlobalTypingSpeed();
        res.json({ averageWPM });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});
io.on('connect', (socket) => {

    socket.on('userInput', async ({ userInput, gameID }) => {
        try {
            // console.log(userInput);
            // find the game
            let game = await Game.findById(gameID);
            // if game has started and game isn't over
            if (!game.isOpen && !game.isOver) {
                // get player making the request
                let player = game.players.find(player => player.socketID === socket.id);
                // get current word the user has to type
                let currentWord = game.words[player.currentWordIndex];
                let currentLetter = currentWord[player.currentLetterIndex];
                // if player typed word correctly
                if (currentLetter === userInput) {
                    // Advance the player to the next letter
                    player.currentLetterIndex++;
                    // if user hasn't finished typing the sentence
                    if (player.currentLetterIndex === currentWord.length) {
                        // Reset the currentLetterIndex for the next word
                        player.currentLetterIndex = 0;

                        // Advance the player to the next word
                        player.currentWordIndex++;
                    }
                    if (player.currentWordIndex !== game.words.length) {
                        let endTime = new Date().getTime();
                        // get timestamp of when the game started
                        let { startTime } = game;
                        // calculate Words Per Minute
                        player.WPM = calculateWPM(endTime, startTime, player);
                        // save the game
                        game = await game.save();
                        // send updated game to all sockets within game
                        io.to(gameID).emit('updateGame', game);
                    }
                    // player is done typing sentence
                    else {
                        // get timestamp of when the user finished
                        let endTime = new Date().getTime();
                        // get timestamp of when the game started
                        let { startTime } = game;
                        // calculate Words Per Minute
                        player.WPM = calculateWPM(endTime, startTime, player);
                        // save game
                        game = await game.save();
                        // stops timer for that player
                        socket.emit('done');
                        // send updated game to all sockets within game
                        io.to(gameID).emit('updateGame', game);
                    }
                }
                else {
                    // If the word is wrong, emit a 'wrongWord' event to the specific user's socket
                    socket.emit('wrongWord');
                }
            }

        } catch (err) {
            console.log(err);
        }
    });

    socket.on('timer', async ({ gameID, playerID }) => {
        // time in seconds
        let countDown = 5;
        // find game
        let game = await Game.findById(gameID);
        // find player who made request
        let player = game.players.id(playerID);
        // check if player has permission to start game
        if (player.isPartyLeader) {
            // start time countdown
            let timerID = setInterval(async () => {
                // keep counting down until we hit 0
                if (countDown >= 0) {
                    // emit countDown to all players within game
                    io.to(gameID).emit('timer', { countDown, msg: "Starting Game" });
                    countDown--;
                }
                // start time clock over, now time to start game
                else {
                    // close game so no one else can join
                    game.isOpen = false;
                    // save the game
                    game = await game.save();
                    // send updated game to all sockets within game
                    io.to(gameID).emit('updateGame', game);
                    // start game clock
                    startGameClock(gameID);
                    clearInterval(timerID);
                }
            }, 1000);
        }
    });

    socket.on('quitGame', async ({ gameID }) => {
        try {
            // Find the game
            let game = await Game.findById(gameID);

            // Check if the game has started and isn't over
            if (!game.isOver) {
                // Get the player who wants to quit the game
                let player = game.players.find(player => player.socketID === socket.id);
                player.WPM = 0;
                game = await game.save();
                socket.emit('done');
                io.to(gameID).emit('updateGame', game);
            }
        } catch (err) {
            console.log(err);
        }
    });
    socket.on('join-game', async ({ gameID: _id, nickName }) => {
        try {
            // get game
            let game = await Game.findById(_id);
            // check if game is allowing users to join
            if (game.isOpen) {
                // make players socket join the game room
                const gameID = game._id.toString();
                socket.join(gameID);
                // create our player
                let player = {
                    socketID: socket.id,
                    nickName
                }
                // add player to the game
                game.players.push(player);
                // save the game
                game = await game.save();
                // send updated game to all sockets within game
                io.to(gameID).emit('updateGame', game);
            }
            else {
                // Send a "joinFailed" event to inform the user that they cannot join
                socket.emit('joinFailed', { message: 'The game is already in progress and not accepting new players.' });
            }
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('join-competition', async ({ difficulty, nickName }) => {
        try {
            // get game

        } catch (err) {
            console.log(err);
        }
    });

    socket.on('create-game', async ({ nickName, difficulty }) => {
        try {
            // get words that our users have to type out
            const quotableData = await QuotableAPI(difficulty);
            // create game
            let game = new Game();
            // set words
            game.words = quotableData;
            // create player
            let player = {
                socketID: socket.id,
                isPartyLeader: true,
                nickName
            }
            // add player
            game.players.push(player);
            // save the game
            game = await game.save();
            // make players socket join the game room
            const gameID = game._id.toString();
            socket.join(gameID);
            // send updated game to all sockets within game
            io.to(gameID).emit('updateGame', game);
        } catch (err) {
            console.log(err);
        }
    });
    
    socket.on('join-open-game', async ({ nickName, difficulty }) => {
        try {
            console.log(nickName, CurGameEasy, CurGameMedium, CurGameHard);
            // get open game
            if (difficulty === "easy") {
                if (CurGameEasy === null) {
                    // create a new game 
                    CurGameEasy = new Game();
                    // get words that our users have to type out
                    const quotableData = await QuotableAPI(difficulty);
                    // set words
                    CurGameEasy.words = quotableData;
                    // create player
                    let player = {
                        socketID: socket.id,

                        nickName
                    }
                    // add player
                    CurGameEasy.players.push(player);
                    // save the game
                    CurGameEasy = await CurGameEasy.save();
                    // make players socket join the game room
                    const gameID = CurGameEasy._id.toString();
                    socket.join(gameID);
                    // send updated game to all sockets within game
                    io.to(gameID).emit('updateGame', CurGameEasy);
                    // if game hasnot started after 10 seconds, start the game
                    refgame = CurGameEasy;
                    setTimeout(async () => {
                        // get game
                        let game = await Game.findById(gameID);
                        // check if game is allowing users to join
                        if (game.isOpen) {
                            // close game so no one else can join
                            game.isOpen = false;
                            // save the game
                            game = await game.save();
                            // send updated game to all sockets within game
                            io.to(gameID).emit('updateGame', game);
                            // start game clock
                            startGameClock(gameID);
                            CurGameEasy = null;
                        }
                    }, 60000);





                }
                else {
                    // make players socket join the game room
                    const gameID = CurGameEasy._id.toString();
                    socket.join(gameID);
                    // create our player
                    let player = {
                        socketID: socket.id,
                        nickName
                    }
                    // add player to the game
                    CurGameEasy.players.push(player);
                    // save the game
                    CurGameEasy = await CurGameEasy.save();
                    // send updated game to all sockets within game
                    io.to(gameID).emit('updateGame', CurGameEasy);
                    // if games player count is 2 start the game
                    if (CurGameEasy.players.length === 2) {
                        // close game so no one else can join
                        CurGameEasy.isOpen = false;
                        // save the game
                        CurGameEasy = await CurGameEasy.save();
                        // send updated game to all sockets within game
                        io.to(gameID).emit('updateGame', CurGameEasy);
                        // start game clock
                        startGameClock(gameID);
                        if (CurGameEasy === refgame) {
                            CurGameEasy = null;
                        }


                    }

                }



            }
            else if (difficulty === "medium") {
                if (CurGameMedium === null) {
                    CurGameMedium = new Game();
                    // get words that our users have to type out
                    const quotableData = await QuotableAPI(difficulty);
                    // set words
                    CurGameMedium.words = quotableData;
                    // create player
                    let player = {
                        socketID: socket.id,

                        nickName
                    }
                    // add player
                    CurGameMedium.players.push(player);
                    // save the game
                    CurGameMedium = await CurGameMedium.save();
                    // make players socket join the game room
                    const gameID = CurGameMedium._id.toString();
                    socket.join(gameID);
                    // send updated game to all sockets within game
                    io.to(gameID).emit('updateGame', CurGameMedium);
                    refgame = CurGameMedium;
                    setTimeout(async () => {
                        // get game
                        let game = await Game.findById(gameID);
                        // check if game is allowing users to join
                        if (game.isOpen) {
                            // close game so no one else can join
                            game.isOpen = false;
                            // save the game
                            game = await game.save();
                            // send updated game to all sockets within game
                            io.to(gameID).emit('updateGame', game);
                            // start game clock
                            startGameClock(gameID);
                            if (CurGameMedium === refgame) {
                                CurGameMedium = null;
                            }
                        }
                    }, 60000);




                }
                else {
                    // make players socket join the game room
                    const gameID = CurGameMedium._id.toString();
                    socket.join(gameID);
                    // create our player

                    let player = {
                        socketID: socket.id,
                        nickName
                    }
                    // add player to the game
                    CurGameMedium.players.push(player);
                    // save the game
                    CurGameMedium = await CurGameMedium.save();
                    // send updated game to all sockets within game
                    io.to(gameID).emit('updateGame', CurGameMedium);
                    // if games player count is 2 start the game
                    if (CurGameMedium.players.length === 2) {
                        // close game so no one else can join
                        CurGameMedium.isOpen = false;
                        // save the game
                        CurGameMedium = await CurGameMedium.save();
                        // send updated game to all sockets within game
                        io.to(gameID).emit('updateGame', CurGameMedium);
                        // start game clock
                        startGameClock(gameID);
                        CurGameMedium = null;
                    }


                }
            }
            else if (difficulty === "hard") {
                if (CurGameHard === null) {
                    CurGameHard = new Game();
                    // get words that our users have to type out
                    const quotableData = await QuotableAPI(difficulty);
                    // set words
                    CurGameHard.words = quotableData;
                    // create player
                    let player = {
                        socketID: socket.id,

                        nickName
                    }
                    // add player
                    CurGameHard.players.push(player);
                    // save the game
                    CurGameHard = await CurGameHard.save();
                    // make players socket join the game room
                    const gameID = CurGameHard._id.toString();
                    socket.join(gameID);
                    // send updated game to all sockets within game
                    io.to(gameID).emit('updateGame', CurGameHard);
                    refgame = CurGameHard;
                    setTimeout(async () => {
                        // get game
                        let game = await Game.findById(gameID);
                        // check if game is allowing users to join
                        if (game.isOpen) {
                            // close game so no one else can join
                            game.isOpen = false;
                            // save the game
                            game = await game.save();
                            // send updated game to all sockets within game
                            io.to(gameID).emit('updateGame', game);
                            // start game clock
                            startGameClock(gameID);
                            if (CurGameHard === refgame) {
                                CurGameHard = null;
                            }
                        }
                    }, 60000);




                }
                else {
                    // make players socket join the game room
                    const gameID = CurGameHard._id.toString();
                    socket.join(gameID);
                    // create our player
                    let player = {
                        socketID: socket.id,
                        nickName

                    }
                    // add player to the game
                    CurGameHard.players.push(player);
                    // save the game
                    CurGameHard = await CurGameHard.save();
                    // send updated game to all sockets within game
                    io.to(gameID).emit('updateGame', CurGameHard);

                    // if games player count is 2 start the game
                    if (CurGameHard.players.length === 2) {
                        // close game so no one else can join
                        CurGameHard.isOpen = false;
                        // save the game
                        CurGameHard = await CurGameHard.save();
                        // send updated game to all sockets within game
                        io.to(gameID).emit('updateGame', CurGameHard);
                        // start game clock
                        startGameClock(gameID);
                        CurGameHard = null;
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    });

});
const startGameClock = async (gameID) => {
    // get the game
    let game = await Game.findById(gameID);
    // get time stamp of when the game started
    game.startTime = new Date().getTime();
    // save teh game
    game = await game.save();
    // time is in seconds
    let time = 120;
    // Start the Game Clock
    let timerID = setInterval(function gameIntervalFunc() {
        // keep countdown going
        if (time >= 0) {
            const formatTime = calculateTime(time);
            io.to(gameID).emit('timer', { countDown: formatTime, msg: "Time Remaining" });
            time--;
        }
        // game clock has run out, game is over
        else {
            (async () => {
                // get time stamp of when the game ended
                let endTime = new Date().getTime();
                // find the game
                let game = await Game.findById(gameID);
                // get the game start time
                let { startTime } = game;
                // game is officially over
                game.isOver = true;
                // calculate all players WPM who haven't finished typing out sentence
                game.players.forEach((player, index) => {
                    if (player.WPM === -1)
                        game.players[index].WPM = calculateWPM(endTime, startTime, player);
                });
                // save the game
                game = await game.save();
                // send updated game to all sockets within game
                io.to(gameID).emit('updateGame', game);
                clearInterval(timerID);
            })()
        }
        return gameIntervalFunc;
    }(), 1000);
}

// time is in seconds
// convert it into minutes and seconds
const calculateTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

const calculateWPM = (endTime, startTime, player) => {
    let numOfWords = player.currentWordIndex;
    const timeInSeconds = (endTime - startTime) / 1000;
    const timeInMinutes = timeInSeconds / 60;
    const WPM = Math.floor(numOfWords / timeInMinutes);
    return WPM;
}