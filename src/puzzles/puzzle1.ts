import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import { mod } from '~/util/arithmetic';

export const puzzle1 = new Puzzle({
    day: 1,
    parseInput: (fileData) => {
        return splitFilter(fileData, '').map(Number);
    },
    part1: (numbers) => {
        return numbers.reduce((sum, num, iNum) => {
            return (
                sum + (num === numbers[mod(iNum + 1, numbers.length)] ? num : 0)
            );
        }, 0);
    },
    part2: (numbers) => {
        return numbers.reduce((sum, num, iNum) => {
            return (
                sum +
                (num ===
                numbers[
                    mod(iNum + Math.floor(numbers.length / 2), numbers.length)
                ]
                    ? num
                    : 0)
            );
        }, 0);
    },
});
