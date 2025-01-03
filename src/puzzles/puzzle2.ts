import { Puzzle } from './Puzzle';
import { getNumbersForEachLine } from '~/util/parsing';

export const puzzle2 = new Puzzle({
    day: 2,
    parseInput: (fileData) => {
        return getNumbersForEachLine(fileData);
    },
    part1: (spreadsheet) => {
        return spreadsheet.reduce((sum, row) => {
            return sum + Math.max(...row) - Math.min(...row);
        }, 0);
    },
    part2: (spreadsheet) => {
        return spreadsheet.reduce((sum, row) => {
            for (const num of row) {
                for (const otherNum of row) {
                    if (num !== otherNum && num % otherNum === 0) {
                        return sum + num / otherNum;
                    }
                }
            }
            return sum;
        }, 0);
    },
});
