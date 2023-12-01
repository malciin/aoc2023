import * as fs from 'fs';

export function readLines(name: string): Array<string> {
  return fs.readFileSync(name, { encoding: 'utf8' }).split('\r\n');
}