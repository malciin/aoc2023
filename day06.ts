import { parseNumbersFromLine, readLines } from "./common";

const [ times, distances ] = readLines('day06.txt').map(x => parseNumbersFromLine(x.split(':')[1]));
const [ bigTime, bigDistance ] = [times, distances].map(x => parseInt(x.join('')));
const countWaysToWin = (time: number, distance: number) => Array
  .from({ length: time }, (_, i) => (time - i) * i)
  .reduce((acc, x) => acc + (x > distance ? 1 : 0));

console.log('part 1', times.map((t, i) => countWaysToWin(t, distances[i])).reduce((acc, v) => acc * v, 1));
console.log('part 2', countWaysToWin(bigTime, bigDistance));
