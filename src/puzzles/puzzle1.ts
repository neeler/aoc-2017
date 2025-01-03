import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

export const puzzle1 = new Puzzle({
    day: 1,
    parseInput: (fileData) => {
        return splitFilter(fileData);
    },
    part1: (data) => {
        console.log(data);
    },
    part2: (data) => {
        //
    },
});
