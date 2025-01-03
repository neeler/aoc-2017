import { Puzzle } from './Puzzle';
import { getNumbers } from '~/util/parsing';
import { Direction, Grid } from '~/types/Grid';

export const puzzle3 = new Puzzle({
    day: 3,
    parseInput: (fileData) => {
        return getNumbers(fileData)[0]!;
    },
    part1: (target) => {
        const pow = getMinLargestSquare(target);
        const level = getSpiralLevel(pow);

        if (level === 0) {
            return 0;
        }

        const maxNum = pow ** 2;

        let remainder = maxNum - target;
        while (remainder > level) {
            remainder -= level;
        }

        const sideDistance = level - remainder;

        return level + sideDistance;
    },
    part2: (target) => {
        const gridSize = Math.floor(Math.log(target));
        const grid = new Grid<number>({
            minX: -gridSize,
            minY: -gridSize,
            maxX: gridSize,
            maxY: gridSize,
            defaultValue: () => 0,
        });
        let node = { row: 0, col: 0 };
        grid.setAt(node.row, node.col, 1);
        let value = 1;
        let direction: Direction = 'right';
        let pow = 1;
        let iSeen = 1;
        let nToSee = 1;
        const nSeenOnSide: number[] = [0];

        while (value <= target) {
            node = Grid.getCoordsInDirection(node.row, node.col, direction);
            nSeenOnSide[nSeenOnSide.length - 1]!++;

            if (iSeen >= pow ** 2) {
                pow += 2;
            }

            if (nSeenOnSide[nSeenOnSide.length - 1] === nToSee) {
                direction = leftTurn(direction);
                nSeenOnSide.push(0);

                if (
                    nSeenOnSide.length > 2 &&
                    nSeenOnSide[nSeenOnSide.length - 2] ===
                        nSeenOnSide[nSeenOnSide.length - 3]
                ) {
                    nToSee++;
                }
            }

            value = grid
                .getAllNeighborsOf(node.row, node.col)
                .reduce((acc, neighbor) => acc + (neighbor ?? 0), 0);
            grid.setAt(node.row, node.col, value);
            iSeen++;
        }
        return value;
    },
});

function leftTurn(dir: Direction) {
    switch (dir) {
        case 'right':
            return 'up';
        case 'up':
            return 'left';
        case 'left':
            return 'down';
        case 'down':
            return 'right';
    }
    throw new Error('Invalid direction');
}

function getMinLargestSquare(n: number) {
    let pow = 1;
    while (pow ** 2 < n) {
        pow += 2;
    }
    return pow;
}

function getSpiralLevel(pow: number) {
    if (pow % 2 === 0) {
        return pow / 2;
    }
    return Math.ceil(pow / 2) - 1;
}
