import { readString, sum } from "./common";

const input = readString('day15.txt').split(',');
const computeHash = (ch: string) => ch.split('').reduce((acc, v) => ((acc + v.charCodeAt(0)) * 17) % 256, 0);

console.log(sum(input.map(x => computeHash(x))));

const lenses: string[][] = Array.from({ length: 256 }).map(() => []);
const getLenseName = (entry: string) => entry.split('=')[0].replace('-', ''); 

input.map(x => <string[]>[x, getLenseName(x), computeHash(getLenseName(x))]).forEach(([entry, name, hashSum]) => {
  if (entry.endsWith('-')) {
    lenses[hashSum] = lenses[hashSum].filter(x => getLenseName(x) !== name);
    return;
  }

  const existingIndex = lenses[hashSum].findIndex(x => getLenseName(x) === name);
  
  if (existingIndex !== -1) {
    lenses[hashSum][existingIndex] = entry;
  } else {
    lenses[hashSum].push(entry);
  }
});

console.log(sum(lenses.flatMap((lenses, i) => lenses.map((lense, j) => (i + 1) * (j + 1) * parseInt(lense.split('=')[1])))))
