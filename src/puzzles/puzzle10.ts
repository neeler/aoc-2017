import { Puzzle } from './Puzzle';
import { getNumbers } from '~/util/parsing';
import { range } from '~/util/range';
import { knot, knotHash } from '~/puzzleSpecifics/knotHash';

export const puzzle10 = new Puzzle({
    day: 10,
    parseInput: (fileData) => {
        return fileData;
    },
    part1: (input, { example }) => {
        const { numbers } = knot({
            numbers: range(0, example ? 5 : 256),
            lengths: getNumbers(input),
        });
        return numbers[0]! * numbers[1]!;
    },
    part2: (input) => {
        return knotHash(input);
    },
});
