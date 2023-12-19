import { readLines, sum } from "./common";

interface Element { x: number; m: number; a: number; s: number }
interface Condition { l: string; op: string; r: number; }

const lines = readLines('day19.txt');
const procedures = lines
  .slice(0, lines.indexOf(''))
  .map(x => /(?<procName>\w+)\{(?<procCode>.*)\}/.exec(x).groups)
  .reduce((acc, { procName, procCode }) => ({ ...acc, [procName]: procCode }), {});
const elements: Array<Element> = lines
  .slice(lines.indexOf('') + 1)
  .map(x => [...x.matchAll(/(\d+)/g)].map(x => parseInt(x[0])))
  .map(([x, m, a, s]) => ({ x, m, a, s })); // xmas 🎅
const getRawProcSegments = (proc: string) => procedures[proc].split(',').map(x => x.split(':'));
const parseCondition = (conditionRaw: string): Condition => {
  const { l, op, r } = /(?<l>\w)(?<op>[<>])(?<r>\w+)/.exec(conditionRaw).groups;
  return { l, op, r: parseInt(r) };
}
const evalCondition = (condition: Condition, element: Element): boolean => eval(`${element[condition.l]} ${condition.op} ${condition.r}`);
const getNextProc = (curProc: string, element: Element): string => getRawProcSegments(curProc)
  .find(procSegment => procSegment.length === 1 || evalCondition(parseCondition(procSegment[0]), element))
  .at(-1);

console.log('Part 1', elements.reduce((acc, element) => {
  let curProc = 'in';
  while (curProc !== 'R' && curProc !== 'A') curProc = getNextProc(curProc, element);
  return curProc === 'A' ? acc + sum(Object.values(element)) : acc;
}, 0));

interface Range { from: number, to: number; }
interface ElementRange { x: Range; m: Range; a: Range; s: Range; }

const reverseCondition = (op: Condition): Condition => op.op === '>'
  ? { l: op.l, op: '<', r: op.r + 1 }
  : { l: op.l, op: '>', r: op.r - 1 };
const constrainRange = (ranges: Range, op: string, value: number): Range => op === '>'
  ? [ ranges ].filter(x => x.to > value).map(x => ({  from: Math.max(value + 1, x.from), to: x.to }))[0]
  : [ ranges ].filter(x => x.from < value).map(x => ({ from: x.from, to: Math.min(x.to, value - 1) }))[0];
const countPossibilities = (range: ElementRange, acceptRanges: Array<ElementRange>): number => sum(acceptRanges.map(acceptRange => 'xmas'
  .split('')
  .reduce((acc, v) => acc * (Math.max(0, Math.min(range[v].to, acceptRange[v].to) - Math.max(range[v].from, acceptRange[v].from) + 1)), 1)));
const includeConditionInRange = (range: ElementRange, condition: Condition): ElementRange => ({
  ...range,
  [condition.l]: constrainRange(range[condition.l], condition.op, condition.r)
});

function getAcceptRanges(currentRange: ElementRange, procName: string = 'in', acceptRanges: ElementRange[] = []): ElementRange[] {
  if (procName === 'A' || procName === 'R') {
    if (procName === 'A') acceptRanges.push(currentRange);
    return acceptRanges;
  } 

  for (let procSegment of getRawProcSegments(procName)) {
    if (procSegment.length === 1) {
      getAcceptRanges(currentRange, procSegment[0], acceptRanges);
      continue;
    }
    
    const condition = parseCondition(procSegment[0]);
    getAcceptRanges(includeConditionInRange(currentRange, condition), procSegment[1], acceptRanges);
    currentRange = includeConditionInRange(currentRange, reverseCondition(condition));
  }

  return acceptRanges;
}

const maxRange: ElementRange = {
  x: { from: 1, to: 4_000 },
  m: { from: 1, to: 4_000 },
  a: { from: 1, to: 4_000 },
  s: { from: 1, to: 4_000 },
};

console.log('part2', countPossibilities(maxRange, getAcceptRanges(maxRange)));
