import { readLines } from "./common";

interface CubesCount { red: number; green: number; blue: number; }

const limits: CubesCount = { red: 12, green: 13, blue: 14 };
const getCubesCount = (revealString: string): CubesCount => revealString
  .split(', ')
  .map(x => x.split(' '))
  .reduce((acc, [v, name]) => ({...acc, [name]: parseInt(v) }), { red: 0, green: 0, blue: 0 })

let part1 = 0;
let part2 = 0;

for (const line of readLines('day02.txt')) {
  const { id, content } = /Game (?<id>\d+)\: (?<content>.*)/.exec(line)?.groups!;
  const revealResults = content.split('; ').map(x => getCubesCount(x));

  if (revealResults.every(x => x.red <= limits.red && x.green <= limits.green && x.blue <= limits.blue)) {
    part1 += parseInt(id);
  }

  part2 += Math.max(...revealResults.map(x => x.red))
    * Math.max(...revealResults.map(x => x.green))
    * Math.max(...revealResults.map(x => x.blue));
}

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
