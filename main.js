const board = [];
for (let y = -1; y < 21; y++) {
  board[y] = [];
  for (let x = -1; x < 11; x++) {
    if (y === 20 || x < 0 || x >= 10) {
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
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 10; x++) {
      const v = board[y][x];
      let edgeColor, bgColor;
      if (v === 0) {
        edgeColor = "#888";
        bgColor = "#ccc";
      } else {
        edgeColor = `hsl(${((v - 1) / 7) * 360}deg, 100%, 50%)`;
        bgColor = `hsl(${((v - 1) / 7) * 360}deg, 100%, 70%)`;
      }
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.left = `${x * 24}px`;
      div.style.top = `${y * 24}px`;
      div.style.width = `24px`;
      div.style.height = `24px`;
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

let ci = 7, cx = 4, cy = 2, cr = 0;
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
}

window.onload = () => {
  putBlock(ci, cx, cy, cr);

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
