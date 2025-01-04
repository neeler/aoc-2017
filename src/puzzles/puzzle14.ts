import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import { Grid, GridNode } from '~/types/Grid';
import { knotHash } from '~/puzzleSpecifics/knotHash';
import { Queue } from '~/types/Queue';

class Node extends GridNode {
    isSquare = false;
}

export const puzzle14 = new Puzzle({
    day: 14,
    parseInput: (fileData) => {
        const key = splitFilter(fileData)[0]!;
        const grid = Grid.fromSize<Node>({
            width: 128,
            height: 128,
            defaultValue: (row, col) =>
                new Node({
                    row,
                    col,
                }),
        });
        for (let row = 0; row < grid.height; row++) {
            const hash = knotHash(`${key}-${row}`);
            const bits = hash
                .split('')
                .flatMap((hex) =>
                    parseInt(hex, 16).toString(2).padStart(4, '0').split(''),
                );
            bits.forEach((bit, col) => {
                grid.get({ row, col })!.isSquare = bit === '1';
            });
        }
        return grid;
    },
    part1: (grid) => {
        return grid.filter((node) => node.isSquare).length;
    },
    part2: (grid) => {
        const nodesSeen = new Set<Node>();
        let nRegions = 0;
        grid.forEach((node) => {
            if (node?.isSquare && !nodesSeen.has(node)) {
                nRegions++;
                const region = new Set<Node>();
                const queue = new Queue<Node>();
                queue.add(node);
                region.add(node);
                nodesSeen.add(node);
                queue.process((node) => {
                    for (const neighbor of grid.getOrthogonalNeighborsOf(
                        node.row,
                        node.col,
                    )) {
                        if (neighbor.isSquare && !region.has(neighbor)) {
                            queue.add(neighbor);
                            region.add(neighbor);
                            nodesSeen.add(neighbor);
                        }
                    }
                });
            }
        });
        return nRegions;
    },
});
