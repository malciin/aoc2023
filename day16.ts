import { getMatrixEntries, readLines } from "./common";

interface Ray { pos: [number, number]; dir: [number, number]; }

const map = readLines('day16.txt').map(x => x.split(''));
const rayTick = (ray: Ray): Ray => ({ dir: ray.dir, pos: [ ray.pos[0] + ray.dir[0], ray.pos[1] + ray.dir[1] ] });
const getRayId = (ray: Ray) => `${ray.pos[0]};${ray.pos[1]};${ray.dir[0]};${ray.dir[1]}`;

function* step(ray: Ray): Iterable<Ray> {
  const field = map[ray.pos[1]]?.[ray.pos[0]];
  const [dirX, dirY] = ray.dir;

  if ((field === '|' && dirX !== 0) || (field === '-' && dirY !== 0)) {
    yield rayTick({ pos: ray.pos, dir: [ dirY,  dirX] });
    yield rayTick({ pos: ray.pos, dir: [-dirY, -dirX] });
    return;
  }

  if (field === '/')  ray.dir = [-dirY, -dirX];
  if (field === '\\') ray.dir = [ dirY,  dirX];

  yield rayTick(ray);
}

function getEnergizedTilesCount(rays: Array<Ray>): number {
  const seenRayIds = new Set<string>();
  const seenValidMapPos = new Set<string>();

  while (rays.length > 0) {
    rays = rays
      .filter(ray => !seenRayIds.has(getRayId(ray)) && map[ray.pos[1]]?.[ray.pos[0]] !== undefined)
      .flatMap(ray => {
        seenRayIds.add(getRayId(ray));
        seenValidMapPos.add(`${ray.pos[0]},${ray.pos[1]}`);
        return [...step(ray)];
      });
  }

  return seenValidMapPos.size;
}

console.log('Part 1', getEnergizedTilesCount([ { pos: [0, 0], dir: [1, 0] } ]));

// bruteforce - took around ~8m to compute
console.log('Part 2', Math.max(...getMatrixEntries(map).flatMap(({ col, row }) =>
  [ [1, 0], [-1, 0], [0, 1], [0, -1] ].map(dir => getEnergizedTilesCount([ { pos: [ col, row ], dir: <[number, number]>dir } ])))));
