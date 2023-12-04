import { readLines } from "./common";

const parseNumbers = (numbersRaw: string): number[] => numbersRaw.split(' ').filter(x => x !== '').map(x => parseInt(x));
const cards = readLines('day04.txt')
  .map(line => /(.*):(?<winningNumbersRaw>.*) \| (?<numbersRaw>.*)/.exec(line)?.groups!)
  .map(({ winningNumbersRaw, numbersRaw }) => ({
    winningNumbers: new Set(parseNumbers(winningNumbersRaw)),
    numbers: parseNumbers(numbersRaw)
  }));
const cardsWinNumbersLength = cards.map(c => c.numbers.filter(x => c.winningNumbers.has(x)).length);

console.log("Part 1:", cardsWinNumbersLength.reduce((acc, v) => acc + Math.floor(Math.pow(2, v - 1)), 0));

const cardsWins = cardsWinNumbersLength.map((count, cardId) => Array.from({ length: count }, (_, i) => i + cardId + 1));
const cardsCount: number[] = Array.from({ length: cards.length }, _ => 1);
const countCards = (cardId: number) => cardsWins[cardId].forEach(winCardId => {
  cardsCount[winCardId]++;
  countCards(winCardId);
});
cards.forEach((_, cardId) => countCards(cardId));

console.log("Part 2:", cardsCount.reduce((acc, v) => acc + v, 0));
