import * as fs from 'fs';

export function readLines(name: string): Array<string> {
  return fs.readFileSync(name, { encoding: 'utf8' }).split('\r\n');
}

export function parseNumbersFromLine(str: string): number[] {
  return str.split(' ').filter(x => x !== '').map(x => parseInt(x));
}
