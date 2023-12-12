import { readLines, sum } from "./common";

const input = readLines('day12.txt')
  .map(x => x.split(' '))
  .map(([ springs, row ]) => <[string, string[]]>[ springs, row.split(',').map(x => '#'.repeat(parseInt(x)) + '.') ]);
  
function countPossibleWays(input: string, segments: string[], inputIdx: number = 0, segmentIdx: number = 0, cache: Record<string, number> = {}) {
  const cacheKey = `${inputIdx}:${segmentIdx}`;
  if (cacheKey in cache) return cache[cacheKey];
  if (segmentIdx === segments.length) return input.substring(inputIdx).includes('#') ? 0 : 1;
  
  let count = 0;
  let n = input.length - segments.slice(segmentIdx).reduce((acc, v) => acc + v.length, -2);

  for (let i = inputIdx; i < n; i++) {
    const check = input.substring(i, i + segments[segmentIdx].length);
    const regex = new RegExp(check.replaceAll('.', '\\.').replaceAll('?', '.'))

    if (check.includes('#')) n = Math.min(n, i + 1 + check.indexOf('#'));
    if (regex.test(segments[segmentIdx].substring(0, check.length))) {
      count += countPossibleWays(input, segments, i + segments[segmentIdx].length, segmentIdx + 1, cache);
    }
  }

  cache[cacheKey] = count;
  return count;
}

console.log('Part 1', sum(input.map(v => countPossibleWays(v[0], v[1]))));
console.log('Part 2', sum(input.map(v => countPossibleWays(Array(5).fill(v[0]).join('?'), Array(5).fill(v[1]).flat()))));
