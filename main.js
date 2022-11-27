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
    for (let num_rotation = 0; num_rotation < rotation % 4; num_rotation++) {
      [dx, dy] = [dy, -dx];
    }

    if (remove) {
      board[y + dy][x + dx] = 0;
    } else {
      // すでにミノブロックが置かれている場合は置かない
      if (board[y + dy][x + dx]) {
        return false;
      }
      // すべてのブロックを置くことができるならば置く
      if (can_put) {
        board[y + dy][x + dx] = blockIndex;
      }
    }
  }

  // ここまで実行できていればすべてのブロックを置くことができるので
  // 自分自身を呼び出しミノブロックを置く
  if (!can_put) {
    putBlock(blockIndex, x, y, rotation, remove, true);
  }
  return true;
};

window.onload = () => {
  putBlock(5, 4, 10, 0);
  putBlock(6, 4, 10, 0); // このミノブロックは置くことができない
  putBlock(5, 4, 10, 0, true);
  putBlock(7, 4, 10, 0); // 削除後であるからミノブロックを置くことができる
  showBoard();
};
