import { readLines } from "./common";

type PulseValue = 0 | 1;
interface Pulse { loc: string, source: string, value: PulseValue };

const modulesByName: Record<string, { type: string, name: string, to: string[] }>  = readLines('day20.txt')
  .map(line => /(?<type>[%&]?)(?<name>\w+) -> (?<to>.*)/.exec(line).groups)
  .map(({ type, name, to }) => ({ type, name, to }))
  .reduce((acc, { type, name, to }) => ({ ...acc, [name]: { type, name, to: to.split(', ') } }), {});
const flipFlopState: Record<string, boolean> = Object
  .values(modulesByName)
  .filter(x => x.type === '%')
  .reduce((acc, x) => ({ ...acc, [x.name]: false }), {});
const conjunctionStates: Record<string, Record<string, PulseValue>> = Object
  .values(modulesByName)
  .filter(x => x.type === '&')
  .reduce((acc, x) => ({
    ...acc,
    [x.name]: Object
      .values(modulesByName)
      .filter(y => y.to.some(z => z === x.name))
      .reduce((acc, v) => ({ ...acc, [v.name]: 0 }), {})
  }), {});

const createNext = (sourcePulse: Pulse, value: PulseValue): Pulse[] =>
  modulesByName[sourcePulse.loc].to.map(l => ({ source: sourcePulse.loc, loc: l, value: value }))

const pulseCodeByType: Record<string, (pulse: Pulse) => Pulse[]> = {
  '': p => createNext(p, 0),
  '%': p => {
    if (p.value === 1) return [];

    flipFlopState[p.loc] = !flipFlopState[p.loc];

    return createNext(p, flipFlopState[p.loc] ? 1 : 0);
  },
  '&': p => {
    const state = conjunctionStates[p.loc];
    state[p.source] = p.value;
    const nextPulse = Object.values(state).every(x => x) ? 0 : 1;

    return createNext(p, nextPulse);
  }
};

let hiPulses = 0;
let loPulses = 0;

for (let i = 0; i < 1_000; i++) {
  let pulses: Array<Pulse> = [ { loc: 'broadcaster', source: '', value: 0 } ];

  while (pulses.length > 0) {
    let pulsesToProcessPerTick = pulses.length;

    for (let i = 0; i < pulsesToProcessPerTick; i++) {
      const module = modulesByName[pulses[i].loc];

      if (pulses[i].value === 0) loPulses++;
      else hiPulses++;

      if (module === undefined) continue;

      pulseCodeByType[module.type](pulses[i]).forEach(p => pulses.push(p));
    }

    pulses = pulses.slice(pulsesToProcessPerTick);
  }
}

console.log('Part 1', hiPulses * loPulses)

// clean state for part 2
Object.keys(flipFlopState).forEach(x => flipFlopState[x] = false);
Object.keys(conjunctionStates).forEach(x => Object.keys(conjunctionStates[x]).forEach(y => conjunctionStates[x][y] = 0))

let requiredKeyPresses = 0;

const rxSourceModule = Object.values(modulesByName).find(x => x.to.includes('rx'));
const watchedModules = new Set<string>(Object.values(modulesByName).filter(x => x.to.includes(rxSourceModule.name)).map(x => x.name));
const firedAtByModuleName = {};
const pulseCodeByTypeForPart2: Record<string, (pulse: Pulse) => Pulse[]> = {
  ...pulseCodeByType,
  '&': p => {
    const nextPulse = pulseCodeByType['&'](p);

    if (watchedModules.has(p.loc)
      && nextPulse[0]?.value === 1
    && firedAtByModuleName[p.loc] === undefined) {
      firedAtByModuleName[p.loc] = requiredKeyPresses;
    }

    return nextPulse;
  }
};

while (Object.keys(firedAtByModuleName).length !== watchedModules.size) {
  requiredKeyPresses++;
  let pulses: Array<Pulse> = [ { loc: 'broadcaster', source: '', value: 0 } ];

  while (pulses.length > 0) {
    let pulsesToProcessPerTick = pulses.length;

    for (let i = 0; i < pulsesToProcessPerTick; i++) {
      const module = modulesByName[pulses[i].loc];

      if (module === undefined) continue;

      pulseCodeByTypeForPart2[module.type](pulses[i]).forEach(p => pulses.push(p));
    }

    pulses = pulses.slice(pulsesToProcessPerTick);
  }
}

/// copied from day8
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

let firedAt: number[] = Object.values(firedAtByModuleName);

console.log('part 2', BigInt(firedAt.slice(1).reduce((acc, v) => lcm(acc, v), firedAt[0])));
