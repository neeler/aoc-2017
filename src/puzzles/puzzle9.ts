import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

export const puzzle9 = new Puzzle({
    day: 9,
    parseInput: (fileData) => {
        return splitFilter(fileData)[0]!;
    },
    part1: (stream) => {
        let totalScore = 0;
        let score = 0;
        let inGarbage = false;
        let ignoreNext = false;
        for (const char of stream.split('')) {
            if (ignoreNext) {
                ignoreNext = false;
                continue;
            }

            if (char === '!') {
                ignoreNext = true;
                continue;
            }

            if (inGarbage) {
                if (char === '>') {
                    inGarbage = false;
                }
                continue;
            }

            if (char === '<') {
                inGarbage = true;
                continue;
            }

            if (char === '{') {
                score++;
                totalScore += score;
            } else if (char === '}') {
                score--;
            }
        }
        return totalScore;
    },
    part2: (stream) => {
        let nCancelledChars = 0;

        let inGarbage = false;
        let ignoreNext = false;
        for (const char of stream.split('')) {
            if (ignoreNext) {
                ignoreNext = false;
                continue;
            }

            if (char === '!') {
                ignoreNext = true;
                continue;
            }

            if (inGarbage) {
                if (char === '>') {
                    inGarbage = false;
                } else {
                    nCancelledChars++;
                }
                continue;
            }

            if (char === '<') {
                inGarbage = true;
                continue;
            }
        }
        return nCancelledChars;
    },
});
