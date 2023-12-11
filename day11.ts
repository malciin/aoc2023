import { Coords, getMatrixEntries, readLines, sum } from "./common";

const universe = readLines('day11.txt').map(x => x.split(''));
const emptyRows = Array.from({ length: universe.length }, (_, i) => i).filter((x) => universe[x].every(x => x === '.'));
const emptyCols = Array.from({ length: universe[0].length }, (_, i) => i).filter(x => universe.every(u => u[x] === '.'));
const galaxies = getMatrixEntries(universe).filter(x => x.value === '#');

function distance(from: Coords, to: Coords, expansionFactor: number): number {
  const expandedStepsX = Array.from({ length: Math.abs(from.col - to.col) }, (_, i) => Math.min(from.col, to.col) + 1 + i)
    .filter(x => emptyCols.includes(x))
    .map(_ => expansionFactor - 1);
  const expandedStepsY = Array.from({ length: Math.abs(from.row - to.row) }, (_, i) => Math.min(from.row, to.row) + 1 + i)
    .filter(x => emptyRows.includes(x))
    .map(_ => expansionFactor - 1);

  return sum([
    Math.abs(from.row - to.row),
    Math.abs(to.col - from.col),
    ...expandedStepsX,
    ...expandedStepsY ]);
};

function* getUniquePairs<T>(array: Array<T>): Iterable<[T, T]> {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      yield [array[i], array[j]];
    }
  }
}

console.log('Part1', sum([...getUniquePairs(galaxies)].map(v => distance(v[0], v[1], 2))));
console.log('Part2', sum([...getUniquePairs(galaxies)].map(v => distance(v[0], v[1], 1000000))));
