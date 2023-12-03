import { readLines } from "./common";

const map = readLines('day03.txt');
const directions = [ [-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1] ];
const isAdjacentTo = (row: number, col: number, regex: RegExp): boolean => directions
  .map(([i, j]) => map[row + i]?.[col + j])
  .filter(x => x !== undefined)
  .some(char => regex.test(char));

let part1 = 0;
const adjacentNumbersToSymbolsLookup: Record<string, { num: number, id: string }> = {};
for (const [row, value] of map.entries()) {
  for (const match of [...value.matchAll(/\d+/g)].filter(x => [...x[0]].some((_, i) => isAdjacentTo(row, x.index + i, /[^\d\.]/)))) {
    part1 += parseInt(match[0]);

    for (let i = 0; i < match[0].length; i++) {
      adjacentNumbersToSymbolsLookup[`${row};${match.index + i}`] = { num: parseInt(match[0]), id: `${row};${match.index}` };
    }
  }
}

let part2 = 0;
for (const [row, value] of map.entries()) {
  for (const match of [...value.matchAll(/\*/g)].filter(m => isAdjacentTo(row, m.index, /\d/))) {
    const adjacentGearNumbers = directions
      .map(([i, j]) => adjacentNumbersToSymbolsLookup[`${row + i};${match.index + j}`])
      .filter(x => x !== undefined);
    const gearNumbers = [...new Set(adjacentGearNumbers.map(x => x.id))]
      .map(id => adjacentGearNumbers.find(x => x.id === id).num);

    if (gearNumbers.length === 2) part2 += gearNumbers.reduce((acc, x) => acc * x, 1);
  }
}

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
