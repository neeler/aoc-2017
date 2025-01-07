import { Puzzle } from './Puzzle';
import { parseStringBlock, splitFilter } from '~/util/parsing';
import { Grid, GridConfig } from '~/types/Grid';

class ArtGrid extends Grid<string> {
    artGridKey: string;

    constructor(data: GridConfig<string>) {
        super(data);
        this.artGridKey = ArtGrid.getArtGridKey(this);
    }

    static fromStringBlock(input: string) {
        const parsed = parseStringBlock(input.replaceAll('/', '\n'));
        const width = Math.max(...parsed.map((row) => row.length));
        const height = parsed.length;

        return new ArtGrid({
            maxX: width - 1,
            maxY: height - 1,
            defaultValue: (row, col) => parsed[row]?.[col] ?? 'X',
        });
    }

    static getArtGridKey(artGrid: ArtGrid) {
        return artGrid.grid
            .map((row) => row.map((d) => d ?? 'X').join(''))
            .join('/');
    }

    rotateClockwise(): ArtGrid {
        return new ArtGrid({
            maxX: this.maxX,
            maxY: this.maxY,
            defaultValue: (r, c) => this.getAt(c, this.height - 1 - r) ?? '.',
        });
    }

    getSubGridKey(
        row: number,
        col: number,
        height: number,
        width: number,
    ): string {
        const rows: string[] = [];
        for (let r = 0; r < height; r++) {
            const rowChars: string[] = [];
            for (let c = 0; c < width; c++) {
                rowChars.push(this.getAt(row + r, col + c) ?? '.');
            }
            rows.push(rowChars.join(''));
        }
        return rows.join('/');
    }

    flipHorizontal(): ArtGrid {
        return new ArtGrid({
            maxX: this.maxX,
            maxY: this.maxY,
            defaultValue: (row, col) =>
                this.get({
                    row,
                    col: this.maxX - col,
                }) ?? '.',
        });
    }

    enhance(rules: Map<string, ArtGrid>): ArtGrid {
        let size: number;
        if (this.width % 2 === 0) {
            size = 2;
        } else if (this.width % 3 === 0) {
            size = 3;
        } else {
            throw new Error('Invalid size');
        }

        const enhancedGrid = new ArtGrid({
            maxX: (this.width / size) * (size + 1) - 1,
            maxY: (this.height / size) * (size + 1) - 1,
            defaultValue: () => '.',
        });
        for (let row = 0; row < this.height; row += size) {
            const newRowBase = (row / size) * (size + 1);
            for (let col = 0; col < this.width; col += size) {
                const newColBase = (col / size) * (size + 1);
                const mapping = rules.get(
                    this.getSubGridKey(row, col, size, size),
                );
                if (!mapping) {
                    throw new Error('No rule found');
                }
                for (let subRow = 0; subRow < size + 1; subRow++) {
                    for (let subCol = 0; subCol < size + 1; subCol++) {
                        enhancedGrid.setAt(
                            newRowBase + subRow,
                            newColBase + subCol,
                            mapping.getAt(subRow, subCol) ?? '.',
                        );
                    }
                }
            }
        }

        return enhancedGrid;
    }
}

class Rule {
    before: ArtGrid;
    after: ArtGrid;

    constructor({ before, after }: { before: ArtGrid; after: ArtGrid }) {
        this.before = before;
        this.after = after;
    }

    toString() {
        return `${this.before.artGridKey} => ${this.after.artGridKey}`;
    }
}

export const puzzle21 = new Puzzle({
    day: 21,
    parseInput: (fileData) => {
        const rules = splitFilter(fileData).flatMap((line) => {
            const addAllRotations = (before: ArtGrid, after: ArtGrid) => {
                rules.push(
                    new Rule({
                        before,
                        after,
                    }),
                );
                for (let i = 0; i < 3; i++) {
                    before = before.rotateClockwise();
                    rules.push(
                        new Rule({
                            before,
                            after,
                        }),
                    );
                }
            };

            const [beforeStr, afterStr] = line.split(' => ') as [
                string,
                string,
            ];
            const rules: Rule[] = [];
            let before = ArtGrid.fromStringBlock(beforeStr);
            let after = ArtGrid.fromStringBlock(afterStr);
            addAllRotations(before, after);
            addAllRotations(before.flipHorizontal(), after);
            return rules;
        });
        const ruleMap = new Map<string, ArtGrid>();
        rules.forEach((rule) => {
            ruleMap.set(rule.before.artGridKey, rule.after);
        });
        const initialGrid = ArtGrid.fromStringBlock(`.#./..#/###`);
        return {
            rules,
            ruleMap,
            initialGrid,
        };
    },
    part1: ({ ruleMap, initialGrid }, { example }) => {
        const nIterations = example ? 2 : 5;
        let grid = initialGrid;
        for (let i = 0; i < nIterations; i++) {
            grid = grid.enhance(ruleMap);
        }
        return grid.filter((c) => c === '#').length;
    },
    part2: ({ ruleMap, initialGrid }, { example }) => {
        const nIterations = example ? 2 : 18;
        let grid = initialGrid;
        for (let i = 0; i < nIterations; i++) {
            grid = grid.enhance(ruleMap);
        }
        return grid.filter((c) => c === '#').length;
    },
});
