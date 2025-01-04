import { Puzzle } from './Puzzle';
import { getNumbers, splitFilter } from '~/util/parsing';
import { range } from '~/util/range';
import { mod } from '~/util/arithmetic';
import { chunk } from '~/util/collections';

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
        const lengths = splitFilter(input, '').map((code) =>
            code.charCodeAt(0),
        );
        lengths.push(17, 31, 73, 47, 23);
        const { numbers: sparseHash } = range(0, 64).reduce(
            (data) => knot(data),
            {
                numbers: range(0, 256),
                lengths,
            },
        );
        const chunks = chunk(sparseHash, 16);
        const denseHash = chunks.map((chunk) =>
            chunk.reduce((acc, num) => acc ^ num, 0),
        );
        return denseHash.map((n) => n.toString(16).padStart(2, '0')).join('');
    },
});

function knot({
    currentPos = 0,
    skipSize = 0,
    numbers,
    lengths,
}: {
    currentPos?: number;
    skipSize?: number;
    numbers: number[];
    lengths: number[];
}) {
    for (const len of lengths) {
        if (len > numbers.length) {
            continue;
        }
        for (let i = 0; i < Math.floor(len / 2); i++) {
            const first = mod(currentPos + i, numbers.length);
            const last = mod(currentPos + len - 1 - i, numbers.length);
            const temp = numbers[first]!;
            numbers[first] = numbers[last]!;
            numbers[last] = temp;
        }
        currentPos = mod(currentPos + len + skipSize, numbers.length);
        skipSize++;
    }
    return {
        currentPos,
        skipSize,
        numbers,
        lengths,
    };
}
