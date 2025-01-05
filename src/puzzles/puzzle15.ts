import { Puzzle } from './Puzzle';
import { getMultilineNumbers } from '~/util/parsing';

class Generator {
    value: number;
    factor: number;

    constructor({ factor, value }: { value: number; factor: number }) {
        this.value = value;
        this.factor = factor;
    }

    next() {
        this.value = (this.value * this.factor) % 2147483647;
        return this.value;
    }

    nextPicky(multiple: number) {
        while (this.next() % multiple !== 0) {}
        return this.value;
    }
}

export const puzzle15 = new Puzzle({
    day: 15,
    parseInput: (fileData) => {
        const [a, b] = getMultilineNumbers(fileData) as [number, number];
        return {
            a: new Generator({
                value: a,
                factor: 16807,
            }),
            b: new Generator({
                value: b,
                factor: 48271,
            }),
        };
    },
    part1: ({ a, b }) => {
        let judgeCount = 0;
        const mask = 0b1111111111111111;
        for (let i = 0; i < 40_000_000; i++) {
            if ((a.next() & mask) === (b.next() & mask)) {
                judgeCount++;
            }
        }
        return judgeCount;
    },
    part2: ({ a, b }) => {
        let judgeCount = 0;
        const mask = 0b1111111111111111;
        for (let i = 0; i < 5_000_000; i++) {
            if ((a.nextPicky(4) & mask) === (b.nextPicky(8) & mask)) {
                judgeCount++;
            }
        }
        return judgeCount;
    },
});
