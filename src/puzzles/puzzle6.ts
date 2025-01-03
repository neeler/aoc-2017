import { Puzzle } from './Puzzle';
import { getNumbers } from '~/util/parsing';
import { mod } from '~/util/arithmetic';

export const puzzle6 = new Puzzle({
    day: 6,
    parseInput: (fileData) => {
        return getNumbers(fileData);
    },
    part1: (memory) => {
        let nCycles = 0;

        const distributionsSeen = new Set<string>();
        let key = memory.join(',');

        while (!distributionsSeen.has(key)) {
            distributionsSeen.add(key);
            redistribute(memory);
            key = memory.join(',');
            nCycles++;
        }

        return nCycles;
    },
    part2: (memory) => {
        const distributionsSeen = new Set<string>();
        let key = memory.join(',');

        while (!distributionsSeen.has(key)) {
            distributionsSeen.add(key);
            redistribute(memory);
            key = memory.join(',');
        }

        let nCycles = 0;

        do {
            redistribute(memory);
            nCycles++;
        } while (memory.join(',') !== key);

        return nCycles;
    },
});

function redistribute(memory: number[]) {
    const max = Math.max(...memory);
    const maxIndex = memory.indexOf(max);

    let blocksRemaining = max;
    memory[maxIndex] = 0;

    let i = mod(maxIndex + 1, memory.length);
    while (blocksRemaining > 0) {
        memory[i]! += 1;
        blocksRemaining--;
        i = mod(i + 1, memory.length);
    }
}
