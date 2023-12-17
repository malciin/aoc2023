import { getMatrixEntries, readLines } from "./common";

console.log('Not proud of that bruteforce solution - part 1 computes roughly in 3 minutes, part 2 roughly in 6-8 minutes.');

type Cord = [number, number];

interface Walker {
  pos: Cord;
  dir: Cord;
  currentDirectionSteps: number;
  totalHeatLoss: number;
}

const heatLossMap = readLines('day17.txt').map(x => x.split('').map(x => parseInt(x)));
const walkerDirections: Array<Cord> = [ [-1, 0], [1, 0], [0, -1], [0, 1] ];
const seenWalkersByPos: Record<string, Record<string, Walker>> = {};

const getMinLoss = () => Math.min(...Object.values(seenWalkersByPos[getPosId([heatLossMap[0].length - 1, heatLossMap.length - 1])]).map(x => x.totalHeatLoss));
const getPosId = (cord: Cord) => cord.join(';');
const getWalkerId = (walker: Walker) => `${walker.pos[0]};${walker.pos[1]};${walker.dir[0]};${walker.dir[1]};${walker.currentDirectionSteps}`;
const isSameDir = (a: Cord, b: Cord): boolean => a[0] === b[0] && a[1] === b[1];
const isOppositeDir = (a: Cord, b: Cord): boolean => (a[0] !== 0 && a[0] === -b[0]) || (a[1] !== 0 && a[1] === -b[1]);

function walkerPusherPart1(walker: Walker, dir: Cord) {
  const newPos: Cord = [ walker.pos[0] + dir[0], walker.pos[1] + dir[1] ];
  const lossAtPos = heatLossMap[newPos[1]]?.[newPos[0]];
  const nextWalkerSteps = isSameDir(dir, walker.dir) ? walker.currentDirectionSteps + 1 : 1;

  if (lossAtPos === undefined || nextWalkerSteps > 3) return;

  walkers.push({
    pos: newPos,
    currentDirectionSteps: nextWalkerSteps,
    dir: dir,
    totalHeatLoss: walker.totalHeatLoss + lossAtPos 
  });
}

function walk(walkerPusher: (walker: Walker, dir: Cord) => void): Walker[] {
  let walkersToProcess = walkers.length;
  
  for (let i = 0; i < walkersToProcess; i++) {
    const walker = walkers[i];
    const seenWalkersForPos = seenWalkersByPos[getPosId(walker.pos)];
    const previousWalker = seenWalkersForPos[getWalkerId(walker)];

    if (previousWalker === undefined || previousWalker.totalHeatLoss > walker.totalHeatLoss) {
      seenWalkersForPos[getWalkerId(walker)] = walker;
      walkerDirections.forEach(dir => { if (!isOppositeDir(walker.dir, dir)) walkerPusher(walker, dir); });
    }
  }

  return walkers.slice(walkersToProcess);
}

getMatrixEntries(heatLossMap).forEach(({row, col}) => seenWalkersByPos[getPosId([col, row])] = {});
let walkers: Walker[] = [[1, 0], [0, 1]].map(dir => (<Walker>{ pos: [0, 0], dir: dir, currentDirectionSteps: 0, totalHeatLoss: 0 }));

while (walkers.length > 0) walkers = walk(walkerPusherPart1);

console.log('Part 1', getMinLoss());

function walkerPusherPart2(walker: Walker, dir: Cord) {
  let [posX, posY] = walker.pos;
  let lossSum = 0;
  const steps = isSameDir(walker.dir, dir) ? 1 : 4;
  const nextWalkerSteps = isSameDir(dir, walker.dir) ? walker.currentDirectionSteps + steps : steps;

  for (let i = 0; i < steps; i++) {
    posX += dir[0];
    posY += dir[1];
    lossSum += heatLossMap[posY]?.[posX] ?? 0;
  }

  if (heatLossMap[posY]?.[posX] === undefined || nextWalkerSteps > 10) return null;

  walkers.push({
    pos: [posX, posY],
    dir: dir,
    currentDirectionSteps: nextWalkerSteps,
    totalHeatLoss: walker.totalHeatLoss + lossSum
  });
}

getMatrixEntries(heatLossMap).forEach(({row, col}) => seenWalkersByPos[getPosId([col, row])] = {});
// negative directions [-1, 0] & [0, -1] to simulate change direction at beginning
walkers = [[-1, 0], [0, -1]].map(dir => (<Walker>{ pos: [0, 0], dir: dir, currentDirectionSteps: 0, totalHeatLoss: 0 }));

while (walkers.length > 0) walkers = walk(walkerPusherPart2);

console.log('Part 2', getMinLoss());
