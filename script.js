let board = Array(9).fill("");
let current = "X";
let active = false;

let mode = "";
let difficulty = "easy";

const status = document.getElementById("status");
const cells = document.querySelectorAll(".cell");

let scores = JSON.parse(localStorage.getItem("scores")) || {X:0, O:0, D:0};

updateScores();

document.getElementById("mode").onchange = e => {
  mode = e.target.value;
  start();
};

document.getElementById("difficulty").onchange = e => difficulty = e.target.value;

document.querySelector(".reset").onclick = reset;

document.getElementById("themeToggle").onclick = () =>
  document.body.classList.toggle("light");

cells.forEach(c => c.onclick = () => click(c));

function start(){
  reset();
  active = true;
  status.textContent = "Player X's turn";
}

function click(cell){
  const i = cell.dataset.i;
  if(!active || board[i]) return;

  move(i, current);

  if(mode==="ai" && active && current==="O"){
    setTimeout(aiMove, 400);
  }
}

function move(i, p){
  board[i] = p;
  cells[i].textContent = p;
  check();
}

function check(){
  const win = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for(let w of win){
    const [a,b,c] = w;
    if(board[a] && board[a]===board[b] && board[a]===board[c]){
      w.forEach(i=>cells[i].classList.add("win"));
      end(board[a]);
      return;
    }
  }

  if(!board.includes("")){
    scores.D++;
    end("Draw");
  }

  current = current==="X"?"O":"X";
  status.textContent = `Player ${current}'s turn`;
}

function end(winner){
  active=false;
  if(winner==="Draw"){
    status.textContent="🤝 Draw!";
  } else {
    scores[winner]++;
    status.textContent=`🏆 Player ${winner} wins!`;
    unlock(winner);
  }
  save();
}

function aiMove(){
  let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  let i = empty[Math.floor(Math.random()*empty.length)];
  move(i,"O");
}

function reset(){
  board.fill("");
  cells.forEach(c=>{
    c.textContent="";
    c.classList.remove("win");
  });
  current="X";
  active=true;
}

function save(){
  localStorage.setItem("scores", JSON.stringify(scores));
  updateScores();
}

function updateScores(){
  xScore.textContent=scores.X;
  oScore.textContent=scores.O;
  drawScore.textContent=scores.D;
}

function unlock(p){
  const a = document.getElementById("achievements");
  if(scores[p]===3){
    a.textContent=`🏅 Achievement Unlocked: ${p} Hat-trick!`;
  }
}
