const players = ["Fruits", "Vegetables"];
let pieces = [document.getElementById("Player1-Piece").value, document.getElementById("Player2-Piece").value];
let turn = 0;
let gameOver = false;
let boardSize = parseInt(document.getElementById("boardSize").value);
let startBtn = document.getElementById("start-game");
let textWrapper = document.querySelector('.winner');
const p1_piece = document.getElementById("Player1-Piece");
const p2_piece = document.getElementById("Player2-Piece");
const clear_board = document.getElementById("clear-board");
clear_board.setAttribute("disabled", true);
clear_board.classList.remove("btnfos-a");

let tl = anime({
    loop: false,
    targets: '.winner',
    scale: [4,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 550,
    delay: (el, i) => 70*i
  });

let board = new Array(boardSize)
  .fill("")
  .map(() => new Array(boardSize).fill(""));

let changeBoardSize = (event) => {
  boardSize = parseInt(event.target.value[0]);
  board = new Array(boardSize).fill("").map(() => new Array(boardSize).fill(""));
};

document.getElementById("boardSize").addEventListener("change", changeBoardSize);

let startGame = () => {
  clear_board.removeAttribute("disabled");
  clear_board.classList.add("btnfos-a");
  pieces = [document.getElementById("Player1-Piece").value, document.getElementById("Player2-Piece").value];
  p1_piece.setAttribute("disabled", true);
  p2_piece.setAttribute("disabled", true);
  let dims = document.getElementById("boardSize");

  dims.setAttribute("disabled", true);
  startBtn.setAttribute("disabled", true);
  startBtn.classList.remove("btnfos-a");

  let game = document.getElementById("board");
  game.classList.remove("hide");

  document.getElementById("turn").innerHTML = players[turn % 2] + "' Turn";
  begin();
};

const resetGame = () => {
    clear_board.setAttribute("disabled", true);
    clear_board.classList.remove("btnfos-a");
    p1_piece.removeAttribute("disabled");
    p2_piece.removeAttribute("disabled");
    textWrapper.style.display = "none";
    let dims = document.getElementById("boardSize");
    dims.removeAttribute("disabled");

    document.querySelectorAll('.row').forEach(e => e.remove());
    startBtn.removeAttribute("disabled");
    startBtn.classList.add("btnfos-a");

    let game = document.getElementById("board");
    game.classList.add("hide");
    turn = 0;
    gameOver = false;
    document.getElementById("turn").textContent = "";
    board = new Array(boardSize).fill("").map(() => new Array(boardSize).fill(""));
};

const clearBoard = () => {
  textWrapper.style.display = "none";

  turn = 0;
  gameOver = false;
  document.getElementById("turn").innerHTML = players[turn % 2] + "' Turn";
  document.querySelectorAll('.row').forEach(e => e.remove());
  board = new Array(boardSize).fill("").map(() => new Array(boardSize).fill(""));
  begin();
};

const handleClick = (square, i, j) => {

  const el = square;
  if (el.innerHTML !== "" || gameOver) {
    return;
  }

  board[i][j] = turn % 2 === 0 ? pieces[0] : pieces[1];
  el.innerHTML = board[i][j];

  if (gameWon()) {
    textWrapper.textContent = players[turn%2] + " Win the game!";
    textWrapper.style.display = "block";

    tl.restart();
    gameOver = true;
    return;
  }
  turn++;

  document.getElementById("turn").innerHTML = players[turn % 2] + "' Turn";

  if (turn === boardSize * boardSize) {
    textWrapper.style.display = "block";
    textWrapper.textContent = "Game is a Draw...";
    tl.play();
    gameOver = true;
    return;
  }
};

const begin = () => {
  let board = document.getElementById("board");
  for (let i = 0; i < boardSize; i++) {
    let row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < boardSize; j++) {
      let square = document.createElement("div");
      square.addEventListener("click", (event) => handleClick(square, i, j));
      square.className = "square";
      row.appendChild(square);
    }
    board.appendChild(row);
  }
};

const gameWon = () => {
  let len = board.length;
  if (turn < len) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    if (board[i].every((el) => el === board[i][0] && el !== "")) {
      return true;
    }
    
    let start_col_val = board[0][i];
    let count = 1;
    for (let j = 1; j < len; j++) {
      if (start_col_val === board[j][i] && start_col_val !== "") {
        count++;
      }
    }
    
    if (count === len) {
      return true;
    }
  }

  let i = board[0][0];
  let j = 0;
  while (j < len) {
  
    if (board[0][0] === "") {
      break;
    }
    if (board[j][j] !== i) {
      break;
    } else {
      j++;
    }
  }
 
  if (j === len) {
    return true;
  }

  let rev_i = 0;
  let rev_j = len - 1;
  let rev_val = board[rev_i][rev_j];

  while (rev_i < len) {
    if (board[rev_i][rev_j] === "") {
      break;
    }
    if (rev_val !== board[rev_i][rev_j]) {
      break;
    } else {
      rev_i++;
      rev_j--;
    }
  }
 
  if (rev_i === len) {
    return true;
  }

  return false;
};