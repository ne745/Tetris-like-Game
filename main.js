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

const putBlock = (blockIndex, x, y) => {
  const blockShape = blockShapes[blockIndex];
  for (let [dx, dy] of blockShape) {
    board[y + dy][x + dx] = blockIndex;
  }
};

window.onload = () => {
  putBlock(1, 4, 1);
  putBlock(2, 4, 6);
  putBlock(3, 2, 10);
  putBlock(4, 7, 10);
  putBlock(5, 2, 14);
  putBlock(6, 7, 14);
  putBlock(7, 4, 18);
  showBoard();
};
