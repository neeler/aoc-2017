import { Puzzle } from './Puzzle';
import { DirectionKeys, Grid, GridCoordinate } from '~/types/Grid';

export const puzzle22 = new Puzzle({
    day: 22,
    parseInput: (fileData) => {
        return Grid.stringToNodeGrid(fileData, ({ input }) => input === '#');
    },
    part1: (inputGrid) => {
        const coordInfected = new Map<string, boolean>();
        inputGrid.forEach((isInfected, row, col) => {
            coordInfected.set(
                Grid.getCoordKey({ row, col }),
                isInfected ?? false,
            );
        });
        let coords: GridCoordinate = {
            row: Math.floor(inputGrid.height / 2),
            col: Math.floor(inputGrid.width / 2),
        };
        let direction = DirectionKeys.up;
        let nInfections = 0;
        for (let i = 0; i < 10000; i++) {
            const isInfected =
                coordInfected.get(Grid.getCoordKey(coords)) ?? false;
            direction = isInfected
                ? Grid.turnRight(direction)
                : Grid.turnLeft(direction);
            if (!isInfected) {
                nInfections++;
            }
            coordInfected.set(Grid.getCoordKey(coords), !isInfected);
            coords = Grid.getCoordsInDirection(
                coords.row,
                coords.col,
                direction,
            );
        }
        return nInfections;
    },
    part2: (inputGrid) => {
        const Statuses = {
            clean: 0,
            weakened: 1,
            infected: 2,
            flagged: 3,
        };
        const coordStatus = new Map<string, number>();
        inputGrid.forEach((isInfected, row, col) => {
            coordStatus.set(
                Grid.getCoordKey({ row, col }),
                isInfected ? Statuses.infected : Statuses.clean,
            );
        });
        let coords: GridCoordinate = {
            row: Math.floor(inputGrid.height / 2),
            col: Math.floor(inputGrid.width / 2),
        };
        let direction = DirectionKeys.up;
        let nInfections = 0;
        for (let i = 0; i < 10000000; i++) {
            const status =
                coordStatus.get(Grid.getCoordKey(coords)) ?? Statuses.clean;
            direction = (() => {
                switch (status) {
                    case Statuses.clean:
                        return Grid.turnLeft(direction);
                    case Statuses.weakened:
                        return direction;
                    case Statuses.infected:
                        return Grid.turnRight(direction);
                    case Statuses.flagged:
                        return Grid.turnRight(Grid.turnRight(direction));
                    default:
                        throw new Error('Invalid status');
                }
            })();
            if (status === Statuses.weakened) {
                nInfections++;
            }
            coordStatus.set(Grid.getCoordKey(coords), (status + 1) % 4);
            coords = Grid.getCoordsInDirection(
                coords.row,
                coords.col,
                direction,
            );
        }
        return nInfections;
    },
});
