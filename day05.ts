import * as fs from 'fs';

const parseNumbers = (str: string) => str.split(' ').filter(x => x !== '').map(x => parseInt(x));
const groupNumbers = (numbers: number[], grouping: number): number[][] => Array.from(
  { length: numbers.length / grouping },
  (_, i) => numbers.slice(i * grouping, i * grouping + grouping))
const input = fs.readFileSync('day05.txt', { encoding: 'utf8' })
  .replaceAll(/\r\n(\d)/g, ' $1')
  .split('\r\n')
  .filter(x => x !== '')
  .map(x => parseNumbers(x.split(':')[1]));
const seeds = input[0];
const almanac = input.slice(1).map(x => groupNumbers(x, 3));

function getSeedLocation(step: number): number {
  for (const almanacEntry of almanac) {
    for (const [destination, source, length] of almanacEntry) {
      if (source <= step && source + length > step) {
        step = destination + step - source;
        break;
      }
    }
  }
  
  return step;
}

console.log("Part 1", Math.min(...seeds.map(x => getSeedLocation(x))));

const seedRanges = groupNumbers(seeds, 2);
const doWeHaveThatSeed = (seed: number): boolean => seedRanges
  .some(([seedStart, length]) => seedStart <= seed && seedStart + length >= seed);

// inversion of getSeedLocation function
function getSeedGivenLocation(step: number): number {
  for (const almanacEntry of almanac.slice().reverse()) {
    for (const [destination, source, length] of almanacEntry) {
      if (destination <= step && destination + length > step) {
        step = source + step - destination;
        break;
      }
    }
  }
  
  return step;
}

// problem inversed, rather than enumerating on enormous amount of seeds we enumerating on
// ascending locations and checks if we have got seed for that location 🤡
// Tooks ~8 seconds to compute on my pc 🤡🤡🤡
for (let i = 0; i < 1_000_000_000; i++) {
  const seed = getSeedGivenLocation(i);

  if (doWeHaveThatSeed(seed)) {
    console.log("Part 2", i);
    break;
  }
}
