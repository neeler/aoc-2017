import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import {
    Direction,
    DirectionKeys,
    Grid,
    GridCoordinate,
    GridNode,
} from '~/types/Grid';

class Node extends GridNode {
    input: string;
    isPath: boolean;
    isCorner: boolean;
    letter?: string;

    constructor({
        input,
        row,
        col,
    }: GridCoordinate & {
        input: string;
    }) {
        super({ row, col });
        this.input = input.trim();
        this.isPath = !!this.input;
        this.isCorner = this.input === '+';
        this.letter = input.match(/\w/)?.[0];
    }

    toString(): string {
        return this.input || ' ';
    }
}

export const puzzle19 = new Puzzle({
    day: 19,
    trimInput: false,
    parseInput: (fileData) => {
        const grid = Grid.from2DArray<string, Node>(
            splitFilter(fileData).map((s) => s.split('')),
            ({ input, row, col }) =>
                new Node({
                    input,
                    row,
                    col,
                }),
        );
        const start = grid.find(
            (node) =>
                node.isPath &&
                (node.row === 0 ||
                    node.row === grid.height - 1 ||
                    node.col === 0 ||
                    node.col === grid.width - 1),
        );
        if (!start) {
            throw new Error('Could not find start node.');
        }
        const startDirection =
            start.row === 0
                ? DirectionKeys.down
                : start.row === grid.height - 1
                  ? DirectionKeys.up
                  : start.col === 0
                    ? DirectionKeys.right
                    : DirectionKeys.left;
        return {
            grid,
            start,
            startDirection,
        };
    },
    part1: ({ grid, start, startDirection }) => {
        let namedNodesSeen: string[] = [];

        walkPath({
            grid,
            start,
            startDirection,
            onEachNode: (node) => {
                if (node.letter) {
                    namedNodesSeen.push(node.letter);
                }
            },
        });

        return namedNodesSeen.join('');
    },
    part2: ({ grid, start, startDirection }) => {
        let nSteps = 0;

        walkPath({
            grid,
            start,
            startDirection,
            onEachNode: () => {
                nSteps++;
            },
        });

        return nSteps;
    },
});

function walkPath({
    grid,
    start,
    startDirection,
    onEachNode,
}: {
    grid: Grid<Node>;
    start: Node;
    startDirection: Direction;
    onEachNode: (node: Node) => void;
}) {
    let node: Node | undefined = start;
    const nodesSeen = new Set<Node>();
    nodesSeen.add(start);

    let direction = startDirection;
    while (node?.isPath) {
        onEachNode(node);
        nodesSeen.add(node);

        if (node.isCorner) {
            const neighborsWithDirections =
                grid.getOrthogonalNeighborsWithDirections(node);
            for (const {
                node: neighbor,
                direction: nextDirection,
            } of neighborsWithDirections) {
                if (neighbor.isPath && !nodesSeen.has(neighbor)) {
                    node = neighbor;
                    direction = nextDirection;
                    break;
                }
            }
        } else {
            node = grid.getNeighborInDirection(node.row, node.col, direction);
        }
    }
}
