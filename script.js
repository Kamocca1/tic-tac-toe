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
        if (board[row][column].getValue() !== "") return;
        board[row][column].addMark(playerMark);
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

const GameController = (function (
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = GameBoard;
    const players = [
        {
            name: playerOneName,
            mark: "X",
        },
        {
            name: playerTwoName,
            mark: "O",
        },
    ];
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
        board.placeMark(row, column, getActivePlayer().mark);
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
            return;
        } else if (checkTie()) {
            board.printBoard();
            console.log("It's a tie!");
            return;
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

GameController.playRound(0, 0);
GameController.playRound(1, 0);
GameController.playRound(0, 1);
GameController.playRound(2, 0);
GameController.playRound(0, 2);
