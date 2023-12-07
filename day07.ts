import { readLines } from "./common";

const input = readLines('day07.txt')
  .map(x => x.split(' '))
  .map(([cards, bid]) => <[string[], number]>[ cards.split(''), parseInt(bid) ]);
const cardLetters = 'AKQJT98765432'.split('');
const cardsTypes = <Array<(counts: number[]) => boolean>>[
  counts => counts.some(x => x === 5),
  counts => counts.some(x => x === 4),
  counts => counts.some(x => x === 3) && counts.some(x => x === 2),
  counts => counts.some(x => x === 3),
  counts => counts.filter(x => x === 2).length === 2,
  counts => counts.some(x => x === 2),
  _ => true 
];

const countCards = (str: string[]): Record<string, number> => str.reduce((acc, v) => ({ ...acc, [v]: (acc[v] ?? 0) + 1 }), {});
const getCardsTypeIndex = (cardLetters: string[]): number => {
  const cardsCount = Object.values(countCards(cardLetters));
  return cardsTypes.findIndex(x => x(cardsCount));
}

const cardOrder = (cardsA: string[], cardsB: string[]) => {
  for (let i = 0; i < 5; i++) {
    const aIndx = cardLetters.indexOf(cardsA[i]);
    const bIndx = cardLetters.indexOf(cardsB[i]);

    if (aIndx < bIndx) return 1;
    if (aIndx > bIndx) return -1;
  }

  throw new Error(`Unexpected case: ${cardsA} ${cardsB}`)
}

const sortCards = (cardsA: string[], cardsB: string[]) => {
  const typeA = getCardsTypeIndex(cardsA);
  const typeB = getCardsTypeIndex(cardsB);

  if (typeA < typeB) return 1;
  if (typeA > typeB) return -1;

  return cardOrder(cardsA, cardsB);
};

console.log('part1', input
  .slice()
  .sort((a, b) => sortCards(a[0], b[0]))
  .reduce((acc, v, i) => acc + v[1] * (i + 1), 0));

const cardsTypesWithJokers = <Array<(counts: number[], jokersCount: number) => boolean>>[
  (counts, jokersCount) => jokersCount === 5 || counts.some(x => x === 5 - jokersCount),
  (counts, jokersCount) => counts.some(x => x === 4 - jokersCount),
  (counts, jokersCount) => {
    const indx = counts.findIndex(x => x === 3 - jokersCount);
    return indx !== -1 && counts.some((x, i) => x === 2 && indx !== i)
  },
  (counts, jokersCount) => counts.some(x => x === 3 - jokersCount),
  (counts, _) => counts.filter(x => x === 2).length === 2,
  (counts, jokersCount) => counts.some(x => x === 2 - jokersCount),
  _ => true 
];

const getCardsTypeIndexWithJokers = (cardLetters: string[]): number => {
  const cardsCountLookup = countCards(cardLetters);
  const notJokersCount = Object.entries(cardsCountLookup).filter(x => x[0] !== 'J').map(x => x[1]);

  return cardsTypesWithJokers.findIndex(x => x(notJokersCount, cardsCountLookup['J'] ?? 0));
}

const cardLettersWithJokersPriority = [
  ...cardLetters.filter(x => x !== 'J'),
  'J'
];

const cardOrderWithJokers = (cardsA: string[], cardsB: string[]) => {
  for (let i = 0; i < 5; i++) {
    const aIndx = cardLettersWithJokersPriority.indexOf(cardsA[i]);
    const bIndx = cardLettersWithJokersPriority.indexOf(cardsB[i]);

    if (aIndx < bIndx) return 1;
    if (aIndx > bIndx) return -1;
  }

  throw new Error(`Unexpected case: ${cardsA} ${cardsB}`)
}

const sortCardsWithJokers = (cardsA: string[], cardsB: string[]) => {
  const typeA = getCardsTypeIndexWithJokers(cardsA);
  const typeB = getCardsTypeIndexWithJokers(cardsB);

  if (typeA < typeB) return 1;
  if (typeA > typeB) return -1;

  return cardOrderWithJokers(cardsA, cardsB);
};

console.log('part2', input
  .slice()
  .sort((a, b) => sortCardsWithJokers(a[0], b[0]))
  .reduce((acc, v, i) => acc + v[1] * (i + 1), 0));
