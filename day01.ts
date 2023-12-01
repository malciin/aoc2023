import { readLines } from "./common";

const getTwoDigitNumberFromNumbers = (numbers: ReadonlyArray<number>) => numbers[0] * 10 + numbers.slice(-1)[0];
const getNumberPart1 = (line: string): number => getTwoDigitNumberFromNumbers(line.split('').filter(x => /\d/.test(x)).map(x => parseInt(x)));

function* generateNumbersForPart2(line: string) {
  for (let i = 0; i < line.length; i++) {
    if (/\d/.test(line[i])) yield parseInt(line[i]);
    else if (/^one/.test(line.slice(i))) yield 1;
    else if (/^two/.test(line.slice(i))) yield 2;
    else if (/^three/.test(line.slice(i))) yield 3;
    else if (/^four/.test(line.slice(i))) yield 4;
    else if (/^five/.test(line.slice(i))) yield 5;
    else if (/^six/.test(line.slice(i))) yield 6;
    else if (/^seven/.test(line.slice(i))) yield 7;
    else if (/^eight/.test(line.slice(i))) yield 8;
    else if (/^nine/.test(line.slice(i))) yield 9;
  }
}

const getNumberPart2 = (line: string): number => getTwoDigitNumberFromNumbers(Array.from(generateNumbersForPart2(line)));
const lines = readLines('day01.txt');

console.log(`Part1: ${lines.reduce((acc, line) => acc + getNumberPart1(line), 0)}`);
console.log(`Part2: ${lines.reduce((acc, line) => acc + getNumberPart2(line), 0)}`);
