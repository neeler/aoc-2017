import { mod } from '~/util/arithmetic';
import { splitFilter } from '~/util/parsing';
import { range } from '~/util/range';
import { chunk } from '~/util/collections';

export function knotHash(input: string) {
    const lengths = splitFilter(input, '').map((code) => code.charCodeAt(0));
    lengths.push(17, 31, 73, 47, 23);
    const { numbers: sparseHash } = range(0, 64).reduce((data) => knot(data), {
        numbers: range(0, 256),
        lengths,
    });
    const chunks = chunk(sparseHash, 16);
    const denseHash = chunks.map((chunk) =>
        chunk.reduce((acc, num) => acc ^ num, 0),
    );
    return denseHash.map((n) => n.toString(16).padStart(2, '0')).join('');
}

export function knot({
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
