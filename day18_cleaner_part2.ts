import { lastElement, readLines } from "./common";

interface Vec2 { x: number; y: number; }

const letterDirToVector: Record<string, Vec2> = {
  'R': { x:  1, y:  0 },
  'L': { x: -1, y:  0 },
  'U': { x:  0, y: -1 },
  'D': { x:  0, y:  1 },
}
const hexToLetterDir = { '0': 'R', '1': 'D', '2': 'L', '3': 'U' };

const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
const mult = (a: Vec2, scalar: number): Vec2 => ({ x: a.x * scalar, y: a.y * scalar });
// https://en.m.wikipedia.org/wiki/Shoelace_formula#Trapezoid_formula
const trapezoidShoelace = (points: Vec2[]) => points
  .slice(0, -1)
  .reduce((acc, _, i) => acc + (points[i].y + points[i + 1].y) * (points[i].x - points[i + 1].x), 0) / 2;

let digPositions: Array<Vec2> = [{ x: 0, y: 0 }];
let perimeter = 0;
for (const line of readLines('day18.txt')) {
  const { rgb } =/(?<letterDir>\w) (?<steps>\d+) \(\#(?<rgb>[a-f0-9]+)\)/.exec(line)?.groups!;
  let step = parseInt(rgb.slice(0, -1), 16);

  digPositions.push(add(lastElement(digPositions), mult(letterDirToVector[hexToLetterDir[rgb.slice(-1)]], step)));
  perimeter += step;
}

console.log((trapezoidShoelace(digPositions) * 2 + perimeter) / 2 + 1)
