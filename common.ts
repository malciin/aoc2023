import * as fs from 'fs';

export interface Coords {
  row: number;
  col: number;
}

export interface MatrixEntry<T> extends Coords {
  value: T;
}

export function readString(name: string): string {
  return fs.readFileSync(name, { encoding: 'utf8' });
}

export function readLines(name: string): Array<string> {
  return readString(name).split('\r\n');
}

export function parseNumbersFromLine(str: string): number[] {
  return str.split(' ').filter(x => x !== '').map(x => parseInt(x));
}

export function getMatrixEntries<T>(matrix: T[][]): Array<MatrixEntry<T>> {
  return Object
    .entries(matrix)
    .flatMap(([row, x]) => Object.entries(x).map(([col, ch]) => ({
      row: parseInt(row),
      col: parseInt(col),
      value: ch
    })));
};

export function sum(numbers: Iterable<number>): number {
  return [...numbers].reduce((acc, v) => acc + v, 0);
}
