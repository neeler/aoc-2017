import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

export const puzzle4 = new Puzzle({
    day: 4,
    parseInput: (fileData) => {
        return splitFilter(fileData).map((line) => splitFilter(line, ' '));
    },
    part1: (passwords) => {
        return passwords.filter((password) => {
            return password.length === new Set(password).size;
        }).length;
    },
    part2: (passwords) => {
        return passwords.filter((password) => {
            if (password.length !== new Set(password).size) {
                return false;
            }

            const sortedWordsSeen = new Set<string>();
            for (const word of password) {
                const sortedWord = word.split('').toSorted().join('');
                if (sortedWordsSeen.has(sortedWord)) {
                    return false;
                }
                sortedWordsSeen.add(sortedWord);
            }

            return true;
        }).length;
    },
});
