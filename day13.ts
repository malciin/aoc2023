import * as fs from 'fs';

const input = fs.readFileSync('day13.txt', { encoding: 'utf8' })
  .split('\r\n\r\n')
  .map(x => x.split('\r\n'));

interface Reflection { type: 'x' | 'y', index: number };
const reflectionValue = (reflection: Reflection) => reflection.type === 'x' ? reflection.index + 1 : (reflection.index + 1) * 100;

function getReflection(map: string[], i: number, type: 'x' | 'y'): Reflection | undefined {
  let step = 0;

  while (true) {
    if (i - step < 0) break;
    if (i + 1 + step >= map.length) break;
    if (map[i - step] !== map[i + 1 + step]) return undefined;
    step++;
  }

  return step > 0 ? { type: type, index: i } : undefined;
}

function* genMapsWithSmudgeToggled(map: string[]): Iterable<string[]> {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      const copy = map.slice().map(x => x.split(''))
      copy[row][col] = copy[row][col] === '.' ? '#' : '.';

      yield copy.map(x => x.join(''));
    }
  }
}

function getReflections(map: string[]): Reflection[] {
  const rows = map;
  const cols = Array.from({ length: map[0].length }).map((_, i) => map.map(y => y[i]).join(''));

  return [
    ...rows.map((_, i) => getReflection(rows, i, 'y')),
    ...cols.map((_, i) => getReflection(cols, i, 'x'))
  ].filter(x => x !== undefined);
}

let part1 = 0;
let part2 = 0;

for (const map of input) {
  const reflection = getReflections(map)[0];
  const smudgeReflection = [...genMapsWithSmudgeToggled(map)]
    .flatMap(x => getReflections(x))
    .find(x => x.index !== reflection.index || x.type !== reflection.type);

  part1 += reflectionValue(reflection);
  part2 += reflectionValue(smudgeReflection);
}

console.log('Part 1', part1);
console.log('Part 1', part2);
