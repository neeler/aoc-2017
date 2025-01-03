import { Puzzle } from './Puzzle';
import { getMultilineNumbers } from '~/util/parsing';

export const puzzle5 = new Puzzle({
    day: 5,
    parseInput: (fileData) => {
        return getMultilineNumbers(fileData);
    },
    part1: (jumps) => {
        let index = 0;
        let nSteps = 0;
        while (index >= 0 && index < jumps.length) {
            const jump = jumps[index]!;
            jumps[index]!++;
            index += jump;
            nSteps++;
        }
        return nSteps;
    },
    part2: (jumps) => {
        let index = 0;
        let nSteps = 0;
        while (index >= 0 && index < jumps.length) {
            const jump = jumps[index]!;
            if (jump >= 3) {
                jumps[index]!--;
            } else {
                jumps[index]!++;
            }
            index += jump;
            nSteps++;
        }
        return nSteps;
    },
});
