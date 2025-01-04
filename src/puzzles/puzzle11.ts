import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import { arrayToCountMap } from '~/util/collections';

type HexDirection = 'n' | 's' | 'ne' | 'nw' | 'se' | 'sw';

const directions: HexDirection[] = ['n', 's', 'ne', 'nw', 'se', 'sw'];
const opposites: Record<HexDirection, HexDirection> = {
    n: 's',
    s: 'n',
    ne: 'sw',
    sw: 'ne',
    nw: 'se',
    se: 'nw',
};
const pairs: Record<HexDirection, HexDirection[]> = {
    n: ['ne', 'nw'],
    s: ['se', 'sw'],
    ne: ['n', 'se'],
    nw: ['n', 'sw'],
    se: ['s', 'ne'],
    sw: ['s', 'nw'],
};

export const puzzle11 = new Puzzle({
    day: 11,
    parseInput: (fileData) => {
        return splitFilter(fileData, ',') as HexDirection[];
    },
    part1: (stepsTaken) => {
        const countsOfDirections = simplifyDirections(
            arrayToCountMap(stepsTaken),
        );
        return countSteps(countsOfDirections);
    },
    part2: (stepsTaken) => {
        let maxDistance = 0;
        stepsTaken.reduce((counts, direction) => {
            counts.set(direction, (counts.get(direction) ?? 0) + 1);
            simplifyDirections(counts);
            maxDistance = Math.max(maxDistance, countSteps(counts));
            return counts;
        }, new Map<HexDirection, number>());
        return maxDistance;
    },
});

function countSteps(countsOfDirections: Map<HexDirection, number>) {
    return directions.reduce((sum, direction) => {
        return sum + (countsOfDirections.get(direction) ?? 0);
    }, 0);
}

function simplifyDirections(countsOfDirections: Map<HexDirection, number>) {
    directions.forEach((direction) => {
        const opposite = opposites[direction];
        const count = countsOfDirections.get(direction) ?? 0;
        const oppositeCount = countsOfDirections.get(opposite) ?? 0;

        if (count >= oppositeCount) {
            countsOfDirections.set(direction, count - oppositeCount);
            countsOfDirections.set(opposite, 0);
        } else {
            countsOfDirections.set(direction, 0);
            countsOfDirections.set(opposite, oppositeCount - count);
        }
    });
    directions.forEach((direction) => {
        const pairedDirections = pairs[direction];
        const pairCounts = Math.min(
            ...pairedDirections.map((d) => countsOfDirections.get(d) ?? 0),
        );
        pairedDirections.forEach((d) =>
            countsOfDirections.set(
                d,
                (countsOfDirections.get(d) ?? 0) - pairCounts,
            ),
        );
        countsOfDirections.set(
            direction,
            (countsOfDirections.get(direction) ?? 0) + pairCounts,
        );
    });

    return countsOfDirections;
}
