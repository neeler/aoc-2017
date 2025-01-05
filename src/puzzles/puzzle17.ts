import { Puzzle } from './Puzzle';
import { getNumbers } from '~/util/parsing';

export const puzzle17 = new Puzzle({
    day: 17,
    parseInput: (fileData) => {
        return getNumbers(fileData)[0]!;
    },
    part1: (nSteps) => {
        const buffer = [0];
        let pos = 0;
        for (let i = 1; i <= 2017; i++) {
            pos = ((pos + nSteps) % buffer.length) + 1;
            buffer.splice(pos, 0, i);
        }
        return buffer[(pos + 1) % buffer.length];
    },
    part2: (nSteps) => {
        let pos = 0;
        let iZero = 0;
        let lastNumAfter = 0;

        for (let bufferLength = 1; bufferLength <= 50_000_000; bufferLength++) {
            pos = ((pos + nSteps) % bufferLength) + 1;
            if (pos <= iZero) {
                iZero++;
            } else if (pos === iZero + 1) {
                lastNumAfter = bufferLength;
            }
        }

        return lastNumAfter;
    },
});
