
const grid = document.getElementById('grid');
const rows = 20;
const cols = 20;
let startNode = null;
let endNode = null;

const nodes = [];

for (let row = 0; row < rows; row++) {
  const rowNodes = [];
  for (let col = 0; col < cols; col++) {
    const node = document.createElement('div');
    node.className = 'node';
    node.dataset.row = row;
    node.dataset.col = col;

    node.addEventListener('click', () => {
      if (!startNode) {
        node.classList.add('start');
        startNode = { row, col };
      } else if (!endNode) {
        node.classList.add('end');
        endNode = { row, col };
      } else {
        node.classList.toggle('wall');
      }
    });

    grid.appendChild(node);
    rowNodes.push({ row, col, isWall: false, element: node });
  }
  nodes.push(rowNodes);
}

function getNeighbors(node) {
  const { row, col } = node;
  const neighbors = [];
  const dirs = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
  ];
  for (const [dx, dy] of dirs) {
    const newRow = row + dx;
    const newCol = col + dy;
    if (
      newRow >= 0 &&
      newRow < rows &&
      newCol >= 0 &&
      newCol < cols &&
      !nodes[newRow][newCol].element.classList.contains('wall')
    ) {
      neighbors.push(nodes[newRow][newCol]);
    }
  }
  return neighbors;
}

async function visualizeDijkstra() {
  const visited = [];
  const distances = Array(rows)
    .fill()
    .map(() => Array(cols).fill(Infinity));
  const prev = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));

  const start = nodes[startNode.row][startNode.col];
  const end = nodes[endNode.row][endNode.col];
  distances[start.row][start.col] = 0;

  const queue = [start];

  while (queue.length) {
    queue.sort((a, b) => distances[a.row][a.col] - distances[b.row][b.col]);
    const current = queue.shift();
    if (current === end) break;

    current.element.classList.add('visited');
    await new Promise(r => setTimeout(r, 20));
    visited.push(current);

    for (const neighbor of getNeighbors(current)) {
      const dist = distances[current.row][current.col] + 1;
      if (dist < distances[neighbor.row][neighbor.col]) {
        distances[neighbor.row][neighbor.col] = dist;
        prev[neighbor.row][neighbor.col] = current;
        queue.push(neighbor);
      }
    }
  }

  let curr = end;
  while (curr !== start) {
    curr = prev[curr.row][curr.col];
    if (curr && curr !== start) {
      curr.element.classList.add('path');
      await new Promise(r => setTimeout(r, 30));
    }
  }
}
