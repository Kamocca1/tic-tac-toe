function Cell() {
    let value = "";
    const addMark = (playerMark) => {
        value = playerMark;
    };
    const getValue = () => value;
    return {
        addMark,
        getValue,
    };
}

// GameBoard is now a factory function to allow for resetting the board.
function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }
    const getBoard = () => board;
    const placeMark = (row, column, playerMark) => {
        if (board[row][column].getValue() !== "") return false;
        board[row][column].addMark(playerMark);
        return true;
    };
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => {
            return row.map((cell) => {
                return cell.getValue();
            });
        });
        console.log(boardWithCellValues);
    };
    return {
        getBoard,
        placeMark,
        printBoard,
    };
}

function Player(name, mark) {
    return {
        name,
        mark,
    };
}

// GameController is now a factory to create new game instances with different players.
function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = GameBoard();
    const players = [Player(playerOneName, "X"), Player(playerTwoName, "O")];
    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;
    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };
    const playRound = (row, column) => {
        console.log(
            `Placing ${
                getActivePlayer().name
            }'s mark in square on row ${row} and column ${column}...`
        );
        row = Number(row);
        column = Number(column);
        const markPlaced = board.placeMark(row, column, getActivePlayer().mark);
        if (!markPlaced) {
            return;
        }
        const checkWinner = () => {
            const currentBoard = board.getBoard();
            const mark = getActivePlayer().mark;
            // Check rows
            for (let i = 0; i < 3; i++) {
                if (
                    currentBoard[i][0].getValue() === mark &&
                    currentBoard[i][1].getValue() === mark &&
                    currentBoard[i][2].getValue() === mark
                ) {
                    return true;
                }
            }
            // Check columns
            for (let j = 0; j < 3; j++) {
                if (
                    currentBoard[0][j].getValue() === mark &&
                    currentBoard[1][j].getValue() === mark &&
                    currentBoard[2][j].getValue() === mark
                ) {
                    return true;
                }
            }
            // Check diagonals
            if (
                currentBoard[0][0].getValue() === mark &&
                currentBoard[1][1].getValue() === mark &&
                currentBoard[2][2].getValue() === mark
            ) {
                return true;
            }
            if (
                currentBoard[0][2].getValue() === mark &&
                currentBoard[1][1].getValue() === mark &&
                currentBoard[2][0].getValue() === mark
            ) {
                return true;
            }
            return false;
        };
        const checkTie = () => {
            const currentBoard = board.getBoard();
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (currentBoard[i][j].getValue() === "") {
                        return false;
                    }
                }
            }
            return true;
        };
        if (checkWinner()) {
            board.printBoard();
            console.log(`${getActivePlayer().name} wins!`);
            return "Win";
        } else if (checkTie()) {
            board.printBoard();
            console.log("It's a tie!");
            return "Tie";
        }
        switchActivePlayer();
        printNewRound();
    };
    printNewRound();
    return {
        getBoard: board.getBoard,
        getActivePlayer,
        playRound,
    };
}

// The ScreenController now manages the entire game flow.
const ScreenController = (function () {
    // DOM elements
    const playerForm = document.querySelector(".player-form");
    const player1Input = document.querySelector(".player1-input");
    const player2Input = document.querySelector(".player2-input");
    const startBtn = document.querySelector(".start-btn");
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    let game; // This will hold the current game instance.

    // Updates the screen with the current game state.
    const updateScreen = (roundResult) => {
        if (!game) return;

        boardDiv.textContent = ""; // Clear the board first
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Update the turn/result message
        if (roundResult === "Win") {
            playerTurnDiv.textContent = `${activePlayer.name} wins!`;
        } else if (roundResult === "Tie") {
            playerTurnDiv.textContent = "It's a tie!";
        } else {
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        }

        // Render the game board
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue();

                // Disable cells if the game is over or the cell is taken
                if (
                    roundResult === "Win" ||
                    roundResult === "Tie" ||
                    cell.getValue() !== ""
                ) {
                    cellButton.disabled = true;
                }

                boardDiv.appendChild(cellButton);
            });
        });
    };

    // Handles clicks on the game board.
    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        // Make sure a valid cell was clicked
        if (!selectedRow || !selectedColumn) return;

        const roundResult = game.playRound(selectedRow, selectedColumn);
        updateScreen(roundResult);

        // If the game ended, remove the listener and show the form to restart.
        if (roundResult === "Win" || roundResult === "Tie") {
            boardDiv.removeEventListener("click", clickHandlerBoard);
            startBtn.textContent = "Restart Game";
            playerForm.style.display = "flex";
        }
    }

    // Handles the form submission to start or restart the game.
    playerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const player1Name = player1Input.value.trim() || "Player One";
        const player2Name = player2Input.value.trim() || "Player Two";

        // Create a new game instance with the player names.
        game = GameController(player1Name, player2Name);

        // Set up the UI for the game.
        playerForm.style.display = "none";
        boardDiv.style.display = "grid";
        playerTurnDiv.style.display = "block";

        // Add the event listener for game moves.
        boardDiv.addEventListener("click", clickHandlerBoard);

        updateScreen(); // Initial render of the board.
    });

    // Set the initial UI state on page load.
    boardDiv.style.display = "none";
    playerTurnDiv.style.display = "none";
    playerForm.style.display = "flex";
})();
