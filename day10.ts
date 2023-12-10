import { readLines } from "./common";

// Currently there is no logic to determine sign under S sign, so currently it would need
// human adjustment to work on another input 🤡
const HARDCODED_PIPE_UNDER_S_SIGN = 'J';
const HARDCODED_SIGN_DIRECTIONS = [ [ -1, 0 ], [0, -1] ];

const mapMatrix = readLines('day10.txt').map(x => x.split(''));
const getStepByPipe: Record<string, (coords: [number, number]) => [number, number]> = {
  '|': cord => cord,
  '-': cord => cord,
  'L': ([x, y]) => x === -1 ? [0, -1] : [ 1, 0],
  'J': ([x, y]) => x ===  1 ? [0, -1] : [-1, 0],
  '7': ([x, y]) => x ===  1 ? [0,  1] : [-1, 0],
  'F': ([x, y]) => x === -1 ? [0,  1] : [ 1, 0]
};

const getKey = (row: number, col: number) => `${row}:${col}`;
const getMapEntries = (mapMatrix: string[][]) => Object
  .entries(mapMatrix)
  .flatMap(([row, x]) => Object.entries(x).map(([col, ch]) => <[number, number, string]>[parseInt(row), parseInt(col), ch]));
const [row, col, _] = getMapEntries(mapMatrix).find(([_, __, ch]) => ch === 'S');
mapMatrix[row][col] = HARDCODED_PIPE_UNDER_S_SIGN;
const visited = new Set<string>();
const queue = <Array<[number, number, [number, number], number]>>[
  [row, col, HARDCODED_SIGN_DIRECTIONS[0], 1],
  [row, col, HARDCODED_SIGN_DIRECTIONS[1], 1]
];
let maxDistance = 0;

while (queue.length > 0) {
  let [ row, col, [x, y], distance ] = queue.shift();
  visited.add(getKey(row, col));
  row += y;
  col += x;

  if (!visited.has(getKey(row, col))) {
    if (distance > maxDistance) maxDistance = distance;
    queue.push([ row, col, getStepByPipe[mapMatrix[row][col]]([x, y]), distance + 1 ]);
  }
}

console.log('Part 1', maxDistance);

// Check day10-part2-hint.txt to understand why zooming will handle "squeezing between pipes is also allowed!" case.
const zoomMapX2 = (map: string[][]): string[][] => {
  const zoomedMap = Array.from({ length: map.length * 2 }, () => Array.from({ length: map[0].length * 2 }, () => '.'));

  getMapEntries(map).forEach(([row, col, v]) => {
    zoomedMap[row * 2][col * 2] = v;
    zoomedMap[row * 2][col * 2 + 1] = interpolateHorizontal(v, map[row]?.[col + 1]);
    zoomedMap[row * 2 + 1][col * 2] = interpolateVertical(v, map[row + 1]?.[col]);
  });

  return zoomedMap;
};

function interpolateHorizontal(a: string, b: string): string {
  if (a == '-' && b == '-') return '-';
  if (a == 'F' && b == '7') return '-';
  if (a == 'F' && b == 'J') return '-';
  if (a == 'F' && b == '-') return '-';
  if (a == 'L' && b == 'J') return '-';
  if (a == 'L' && b == '7') return '-';
  if (a == 'L' && b == '-') return '-';
  if (a == '-' && b == '7') return '-';
  if (a == '-' && b == 'J') return '-';

  return '.';
}

function interpolateVertical(a: string, b: string): string {
  if (a == '|' && b == '|') return '|';
  if (a == 'F' && b == 'J') return '|';
  if (a == 'F' && b == 'L') return '|';
  if (a == 'F' && b == '|') return '|';
  if (a == '7' && b == 'L') return '|';
  if (a == '7' && b == 'J') return '|';
  if (a == '7' && b == '|') return '|';
  if (a == '|' && b == 'L') return '|';
  if (a == '|' && b == 'J') return '|';

  return '.';
}

const onlyLoopMapSize2x = zoomMapX2(mapMatrix.map((x, row) => x.map((y, col) => visited.has(getKey(row, col)) ? mapMatrix[row][col] : '.')));
const loopNodes2x = new Set(getMapEntries(onlyLoopMapSize2x).filter(([_, __, ch]) => ch !== '.').map(([row, col, _]) => getKey(row, col)));
const mapSize2x = zoomMapX2(mapMatrix);
const toVisitOuter = [ [0, 0] ];
const outerVisited = new Set<string>();

while (toVisitOuter.length > 0) {
  const [x, y] = toVisitOuter.shift();

  [ [-1, 0], [1, 0], [0, -1], [0, 1] ]
    .map(([xStep, yStep]) => [ x + xStep, y + yStep ])
    .filter(([xNext, yNext]) => mapSize2x[yNext]?.[xNext] !== undefined
      && !loopNodes2x.has(getKey(yNext, xNext))
      && !outerVisited.has(getKey(yNext, xNext)))
    .forEach(([xNext, yNext]) => {
      outerVisited.add(getKey(yNext, xNext));
      toVisitOuter.push([ xNext, yNext ]);
    });
}

console.log('Part 2', getMapEntries(mapSize2x)
  .filter(([row, col, _]) => !outerVisited.has(`${row}:${col}`)
    && !loopNodes2x.has(`${row}:${col}`)
    && Number.isInteger(row / 2)
    && Number.isInteger(col / 2))
  .length);
