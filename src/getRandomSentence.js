import samples from "./samples";

let usedIndexes = [];

export function getRandomSentence() {
  if (usedIndexes.length >= samples.length) {
    usedIndexes = []; // reset
  }

  let index;
  do {
    index = Math.floor(Math.random() * samples.length);
  } while (usedIndexes.includes(index));

  usedIndexes.push(index);
  return samples[index];
}
