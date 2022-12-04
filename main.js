let boardXSize = 10,
  boardYSize = 20;

let numBlock = 7,
  blockSize = 24;

const board = [];
for (let y = -1; y < boardYSize + 1; y++) {
  board[y] = [];
  for (let x = -1; x < boardXSize + 1; x++) {
    if (y === boardYSize || x < 0 || x >= boardXSize) {
      board[y][x] = 1;
    } else {
      board[y][x] = 0;
    }
  }
}

const showBoard = () => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
  for (let y = 0; y < boardYSize; y++) {
    for (let x = 0; x < boardXSize; x++) {
      const v = board[y][x];
      let edgeColor, bgColor;
      if (v === 0) {
        edgeColor = "#888";
        bgColor = "#ccc";
      } else {
        edgeColor = `hsl(${((v - 1) / numBlock) * 360}deg, 100%, 50%)`;
        bgColor = `hsl(${((v - 1) / numBlock) * 360}deg, 100%, 70%)`;
      }
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.left = `${x * blockSize}px`;
      div.style.top = `${y * blockSize}px`;
      div.style.width = `${blockSize}px`;
      div.style.height = `${blockSize}px`;
      div.style.boxSizing = "border-box";
      div.style.border = `4px ridge ${edgeColor}`;
      div.style.backgroundColor = bgColor;
      document.body.appendChild(div);
    }
  }
};

const blockShapes = [
  [[]], // 0 番目は背景に使用しているインデックスのため飛ばす
  [[0, 0], [0, 1], [1, 0], [1, 1]], // O
  [[0, 0], [0, -1], [0, 1], [0, 2]], // I
  [[0, 0], [1, 0], [0, 1], [-1, 1]], // S
  [[0, 0], [-1, 0], [0, 1], [1, 1]], // Z
  [[0, 0], [0, -1], [0, 1], [1, 1]], // L
  [[0, 0], [0, -1], [0, 1], [-1, 1]], // J
  [[0, 0], [-1, 0], [1, 0], [0, -1]], // T
]

const putBlock = (blockIndex, x, y, rotation, remove = false, can_put = false) => {
  const blockShape = blockShapes[blockIndex];
  for (let [dx, dy] of blockShape) {

    // 回転
    for (let num_rotation = 0; num_rotation < rotation % 4; num_rotation++) {
      [dx, dy] = [dy, -dx];
    }

    // 削除
    if (remove) {
      board[y + dy][x + dx] = 0;
      continue;
    }

    // すべてのブロックを置くことができるならば置く
    if (can_put) {
      board[y + dy][x + dx] = blockIndex;
      continue;
    }

    // すでにミノブロックが置かれている場合は置かない
    if (board[y + dy][x + dx]) {
      return false;
    }
  }

  // ここまで実行できていればすべてのブロックを置くことができるので
  // 自分自身を呼び出しミノブロックを置く
  if (!can_put) {
    putBlock(blockIndex, x, y, rotation, remove, true);
  }
  return true;
};

let ci, cx, cy, cr;
let gameover = false;

const move = (dx, dy, dr) => {
  putBlock(ci, cx, cy, cr, true);
  if (putBlock(ci, cx + dx, cy + dy, cr + dr)) {
    cx += dx;
    cy += dy;
    cr += dr;
    showBoard();
    return true;
  } else {
    putBlock(ci, cx, cy, cr)
    return false;
  }
};

const createNewBlock = () => {
  clearLine();

  ci = Math.trunc(Math.random() * numBlock + 1);
  cx = 4;
  cy = 0;
  cr = Math.trunc(Math.random() * 4);

  if (!putBlock(ci, cx, cy, cr)) {
    gameOverProcedure();
  }
};

const gameOverProcedure = () => {
  gameover = true;
  for (let y = 0; y < boardYSize; y++) {
    for (let x = 0; x < boardXSize; x++) {
      if (board[y][x]) {
        board[y][x] = 1;
      }
    }
  }
  showBoard();
}

const clearLine = () => {
  for (let y = 0; y < boardYSize; y++) {
    let removable = true;
    for (let x = 0; x < boardXSize; x++) {
      if (board[y][x] === 0) {
        // 一つでもブロックが置かれていない所があれば消せない
        removable = false;
        break;
      }
    }

    // 一行消す
    // 消す行に上の行をコピーする
    if (removable) {
      for (let j = y; j >= -1; j--) {
        for (let x = 0; x < boardXSize; x++) {
          board[j][x] = (j === -1) ? 0 : board[j - 1][x];
        }
      }
      y--;
    }
  }
};

window.onload = () => {
  createNewBlock();

  setInterval(() => {
    if (gameover) return;
    if (!move(0, 1, 0)) {
      createNewBlock();
    }
  }, 300);

  document.onkeydown = (e) => {
    if (gameover) return;

    switch (e.key) {
      case "ArrowLeft":
        move(-1, 0, 0);
        break;
      case "ArrowRight":
        move(1, 0, 0);
        break;
      case "ArrowDown":
        move(0, 1, 0);
        break;
      case "ArrowUp":
        move(0, 0, 1);
        break;
      default:
        break;
    }
    e.preventDefault();
  }

  showBoard();
};
