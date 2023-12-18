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

let digPositionsPart1: Array<Vec2> = [{ x: 0, y: 0 }];
let digPositionsPart2: Array<Vec2> = [{ x: 0, y: 0 }];

for (const line of readLines('day18.txt')) {
  const { letterDir, steps, rgb } =/(?<letterDir>\w) (?<steps>\d+) \(\#(?<rgb>[a-f0-9]+)\)/.exec(line)?.groups!;
  
  digPositionsPart1.push(add(lastElement(digPositionsPart1), mult(letterDirToVector[letterDir], parseInt(steps))));
  digPositionsPart2.push(add(lastElement(digPositionsPart2), mult(letterDirToVector[hexToLetterDir[rgb.slice(-1)]], parseInt(rgb.slice(0, -1), 16))));
}

// What that function does and why it's required to produce valid results:
// https://github.com/malciin/aoc2023/blob/master/resources/day18_getOuterGridSpanningPoints.png
// Not sure tho if that func produces valid outer span, but for my input it worked 🤡
function getOuterGridSpanningPoints(points: Vec2[]): Vec2[] {
  const maxSpanningPoints = points.slice();

  for (let i = 0; i < maxSpanningPoints.length; i++) {
    let maximizedArea = 0;
    let maximizationStep: Vec2;

    for (const step of [ { x: -0.5, y: -0.5 }, { x: 0.5, y: -0.5 }, { x: -0.5, y: 0.5 }, { x: 0.5, y: 0.5 } ]) {
      maxSpanningPoints[i] = add(points[i], step);
  
      let areaWithNewPoint = trapezoidShoelace(maxSpanningPoints);

      if (areaWithNewPoint > maximizedArea) {
        maximizedArea = areaWithNewPoint;
        maximizationStep = step;
      }
    }
  
    maxSpanningPoints[i] = add(points[i], maximizationStep);
  }

  return maxSpanningPoints;
}

console.log(Math.floor(trapezoidShoelace(getOuterGridSpanningPoints(digPositionsPart1))));
console.log(Math.floor(trapezoidShoelace(getOuterGridSpanningPoints(digPositionsPart2))));
