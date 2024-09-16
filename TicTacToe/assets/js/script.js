window.onload = function() {
    var boxes = document.getElementsByClassName("box");
    var currentPlayer = "X";
    var board = ["", "", "", "", "", "", "", "", ""];
    var gameActive = true;

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    var gameStatus = document.getElementById("game-status");
    var restartButton = document.getElementById("restart-btn");
    restartButton.addEventListener("click", resetGame);

    for (const element of boxes) {
        element.addEventListener("click", mark);
    }

    function mark(e) {
        const boxIndex = e.target.id;
        if (board[boxIndex] !== "" || !gameActive) {
            return;
        }
        board[boxIndex] = currentPlayer;
        e.target.innerText = currentPlayer;

        if (checkWinner()) {
            gameStatus.innerText = `${currentPlayer} wins!`;
            gameActive = false;
            restartButton.style.display = "inline-block";
            return;
        }

        if (board.every(box => box !== "")) {
            gameStatus.innerText = "It's a draw!";
            gameActive = false;
            restartButton.style.display = "inline-block";
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        document.getElementById("turn-indicator").innerText = `Player ${currentPlayer}'s Turn`;
    }

    function checkWinner() {
        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                document.getElementById(a).style.backgroundColor = "lightgreen";
                document.getElementById(b).style.backgroundColor = "lightgreen";
                document.getElementById(c).style.backgroundColor = "lightgreen";
                return true;
            }
        }
        return false;
    }

    function resetGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        currentPlayer = "X";
        gameStatus.innerText = "";
        restartButton.style.display = "none";
        document.getElementById("turn-indicator").innerText = `Player ${currentPlayer}'s Turn`;

        for (let i = 0; i < boxes.length; i++) {
            boxes[i].innerText = "";
            boxes[i].style.backgroundColor = "";
        }
    }
};
