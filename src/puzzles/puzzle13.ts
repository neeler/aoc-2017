import { Puzzle } from './Puzzle';
import { getNumbers, splitFilter } from '~/util/parsing';

interface Layer {
    depth: number;
    range: number;
}

export const puzzle13 = new Puzzle({
    day: 13,
    parseInput: (fileData) => {
        return splitFilter(fileData).map((line): Layer => {
            const [depth, range] = getNumbers(line) as [number, number];
            return {
                depth,
                range,
            };
        });
    },
    part1: (layers) => {
        return layers.reduce((sum, { depth, range }) => {
            const cycleTime = (range - 1) * 2;
            return sum + (depth % cycleTime === 0 ? depth * range : 0);
        }, 0);
    },
    part2: (layers) => {
        let i = 0;
        while (getsCaught(layers, i)) {
            i++;
        }
        return i;
    },
});

function getsCaught(layers: Layer[], delay = 0) {
    for (const { depth, range } of layers) {
        const cycleTime = (range - 1) * 2;
        const timeAtLayer = depth + delay;
        const modTime = timeAtLayer % cycleTime;
        const sentryPosition =
            modTime > range - 1 ? cycleTime - modTime : modTime;
        if (sentryPosition === 0) {
            return true;
        }
    }
    return false;
}
