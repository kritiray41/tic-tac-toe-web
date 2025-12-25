let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = false;
let mode = null;

let xScore = 0, oScore = 0, drawScore = 0;

const statusText = document.getElementById("status");
const cells = document.querySelectorAll(".cell");

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", handleClick));

function setMode(selectedMode) {
  mode = selectedMode;
  resetGame();
  gameActive = true;
  statusText.textContent = "Player X's turn";
}

function handleClick() {
  const i = this.dataset.i;
  if (!gameActive || board[i]) return;

  makeMove(i, currentPlayer);

  if (mode === "ai" && gameActive && currentPlayer === "O") {
    setTimeout(aiMove, 400);
  }
}

function makeMove(i, player) {
  board[i] = player;
  cells[i].textContent = player;
  checkResult();
}

function checkResult() {
  for (let combo of wins) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      combo.forEach(i => cells[i].classList.add("win"));
      gameActive = false;
      statusText.textContent = `🏆 Player ${currentPlayer} wins!`;
      updateScore(currentPlayer);
      return;
    }
  }

  if (!board.includes("")) {
    gameActive = false;
    statusText.textContent = "🤝 Draw!";
    drawScore++;
    document.getElementById("drawScore").textContent = drawScore;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function aiMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  makeMove(move, "O");
}

function minimax(b, depth, isMax) {
  let result = evaluate();
  if (result !== null) return result;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "O";
        best = Math.max(best, minimax(b, depth+1, false));
        b[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "X";
        best = Math.min(best, minimax(b, depth+1, true));
        b[i] = "";
      }
    }
    return best;
  }
}

function evaluate() {
  for (let combo of wins) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] === "O" ? 10 : -10;
    }
  }
  if (!board.includes("")) return 0;
  return null;
}

function updateScore(player) {
  if (player === "X") {
    xScore++;
    document.getElementById("xScore").textContent = xScore;
  } else {
    oScore++;
    document.getElementById("oScore").textContent = oScore;
  }
}

function resetGame() {
  board.fill("");
  cells.forEach(c => {
    c.textContent = "";
    c.classList.remove("win");
  });
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's turn";
}
