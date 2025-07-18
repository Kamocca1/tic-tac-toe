const Cell = (function () {
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue,
    };
})();

const Gameboard = (function () {
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

    const dropToken = (column, player) => {
        const availableCells = board
            .filter((row) => row[column].getValue() === 0)
            .map((row) => row[column]);

        if (!availableCells.length) return;

        const lowestRow = availableCells.length - 1;
        board[lowestRow][column].addToken(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => {
            row.map((cell) => {
                cell.getValue();
            });
        });
        console.log(boardWithCellValues);
    };

    return {
        getBoard,
        dropToken,
        printBoard,
    };
})();

function Player() {}

const GameController = (function () {})();
