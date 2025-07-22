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

const GameBoard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = Cell();
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
})();

function Player(name, mark) {
    return {
        name,
        mark,
    };
}

const GameController = (function (
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = GameBoard;
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
        // Convert row and column to numbers if they are strings
        row = Number(row);
        column = Number(column);
        const markPlaced = board.placeMark(row, column, getActivePlayer().mark);
        if (!markPlaced) {
            // Invalid move, do not switch player or update turn
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
})();

const ScreenController = (function () {
    const game = GameController;
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    console.log("playerTurnDiv:", playerTurnDiv);
    console.log("boardDiv:", boardDiv);
    const updateScreen = () => {
        boardDiv.textContent = "";
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            });
        });
    };
    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        if (!selectedRow || !selectedColumn) return;
        const roundResult = game.playRound(selectedRow, selectedColumn);
        updateScreen();
        if (roundResult === "Win") {
            updateScreen();
            playerTurnDiv.textContent = `${game.getActivePlayer().name} wins!`;
            boardDiv.removeEventListener("click", clickHandlerBoard);
            return;
        } else if (roundResult === "Tie") {
            updateScreen();
            playerTurnDiv.textContent = "It's a tie!";
            boardDiv.removeEventListener("click", clickHandlerBoard);
            return;
        }
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
    updateScreen();
})();
