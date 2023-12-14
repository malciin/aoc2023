import { readLines } from "./common";

const platformOriginal = readLines('day14.txt').map(x => x.split(''));
const [ platformX, platformY ] = [ platformOriginal[0].length, platformOriginal.length ];
const clonePlatform = (platform: string[][]) => platform.map(x => x.slice());
const loadOnNorth = (platform: string[][]) => platform.reduce((acc, v, i) => acc + (platform.length - i) * v.filter(x => x === 'O').length, 0)

const flipNorth = (platform: string[][]) => {
  for (let col = 0; col < platformX; col++) {
    let insertAt = 0;
    for (let row = 0; row < platformY; row++) {
      if (platform[row][col] === '#') insertAt = row + 1;
      if (platform[row][col] === 'O') {
        if (insertAt === row) {
          insertAt = row + 1;
        } else {
          [ platform[insertAt][col], platform[row][col] ] = [ 'O', '.' ];
          insertAt++;
        }
      }
    }
  }
  return platform;
}

console.log('Part 1', loadOnNorth(flipNorth(clonePlatform(platformOriginal))));

const transpose = (platform: string[][]): string[][] => platform[0].map((_, colIndex) => platform.map(row => row[colIndex]));
const flipWest = (platform: string[][]) => transpose(flipNorth(transpose(platform)));
const flipEast = (platform: string[][]) => flipWest(platform.map(x => x.reverse())).map(x => x.reverse());
const flipSouth = (platform: string[][]) => flipNorth(platform.reverse()).reverse();
const cycle = (platform: string[][]) => flipEast(flipSouth(flipWest(flipNorth(platform))));

let platform = clonePlatform(platformOriginal);
const atlas: Record<string, { index: number, platform: string[][] }> = {};
const limit = 1_000_000_000;

for (let i = 0; i < limit; i++) {
  platform = cycle(platform);
  const mapString = platform.map(x => x.join('')).join('\r\n')
  
  if (atlas[mapString] === undefined) {
    atlas[mapString] = { index: i, platform: clonePlatform(platform) };
    continue;
  }

  const cycleStartIndex = atlas[mapString].index;
  const cycleLength = i - cycleStartIndex;
  platform = Object
    .values(atlas)
    .find(x => x.index === cycleStartIndex + (limit - cycleStartIndex - 1) % cycleLength).platform;

  break;
}

console.log('Part 2', loadOnNorth(platform));
