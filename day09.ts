import { parseNumbersFromLine, readLines } from "./common";

const input = readLines('day09.txt').map(x => parseNumbersFromLine(x));
const lastElement = <T>(arr: Array<T>): T => arr[arr.length - 1];

let part1 = 0;
let part2 = 0;

for (let numbers of input) {
  let numsArray = [ numbers ];

  while (lastElement(numsArray).some(x => x !== 0)) {
    numbers = lastElement(numsArray).slice(1).map((_, i) => numbers[i + 1] - numbers[i]);
    numsArray.push(numbers);
  }

  for (let i = numsArray.length - 2; i >= 0; i--) {
    numsArray[i].unshift(numsArray[i][0] - numsArray[i+1][0]);
    numsArray[i].push(lastElement(numsArray[i]) + lastElement(numsArray[i+1]));
  }

  part1 += lastElement(numsArray[0]);
  part2 += numsArray[0][0];
}

console.log(part1);
console.log(part2);
