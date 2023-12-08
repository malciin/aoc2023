import { readLines } from "./common";

const input = readLines('day08.txt');
const directions = input[0].split('');
const map: Record<string, [string, string]> = input.slice(2).reduce((acc, v) => {
  const [from, left, right] = [...v.matchAll(/(\w+)/g)].map(x => x[0]);
  return { ...acc, [from]: [left, right] };
}, {});

let current = map['AAA'];
let i = 0;

while (current !== map['ZZZ']) {
  current = map[current[directions[i++ % directions.length] === 'L' ? 0 : 1]];
}

console.log('Part 1', i);
i = 0;

const ghosts = Object
  .entries(map)
  .filter(([key, _]) => key.endsWith('A'))
  .map(([key, value]) => ({ name: key, nextDirections: value, cycle: null }));

while (!ghosts.every(x => x.cycle !== null)) {
  const dir = directions[i++ % directions.length];

  for (const ghost of ghosts) {
    ghost.name = ghost.nextDirections[dir === 'L' ? 0 : 1];
    ghost.nextDirections = map[ghost.name];

    if (ghost.name.endsWith('Z') && ghost.cycle === null) ghost.cycle = i;
  }
}

const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

console.log('part 2', BigInt(ghosts.slice(1).reduce((acc, v) => lcm(acc, v.cycle), ghosts[0].cycle)));
