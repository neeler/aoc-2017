import { Puzzle } from './Puzzle';
import { getNumbers, splitFilter } from '~/util/parsing';

interface SpinMove {
    type: 'spin';
    spinAmount: number;
}
interface ExchangeMove {
    type: 'exchange';
    exchangeA: number;
    exchangeB: number;
}
interface PartnerMove {
    type: 'partner';
    partnerA: string;
    partnerB: string;
}
type DanceMove = SpinMove | ExchangeMove | PartnerMove;

export const puzzle16 = new Puzzle({
    day: 16,
    parseInput: (fileData, { example }) => {
        const moves = splitFilter(fileData, ',').map((input): DanceMove => {
            switch (input[0]) {
                case 's': {
                    return {
                        type: 'spin',
                        spinAmount: getNumbers(input)[0]!,
                    };
                }
                case 'x': {
                    const [a, b] = getNumbers(input);
                    return {
                        type: 'exchange',
                        exchangeA: a!,
                        exchangeB: b!,
                    };
                }
                case 'p': {
                    const [a, b] = input.slice(1).split('/') as [
                        string,
                        string,
                    ];
                    return {
                        type: 'partner',
                        partnerA: a!,
                        partnerB: b!,
                    };
                }
                default:
                    throw new Error(`Invalid dance move: ${input}`);
            }
        });
        const initialString = example ? 'abcde' : 'abcdefghijklmnop';
        const programs = initialString.split('');
        return {
            initialString,
            moves,
            programs,
        };
    },
    part1: ({ moves, programs }) => {
        dance(programs, moves);
        return programs.join('');
    },
    part2: ({ moves, programs, initialString }) => {
        const max = 1_000_000_000;
        for (let i = 0; i < max; i++) {
            dance(programs, moves);
            if (programs.join('') === initialString) {
                // Cycle detected, fast-forward to the end
                i = max - 1 - (max % (i + 1));
            }
        }
        return programs.join('');
    },
});

function dance(programs: string[], moves: DanceMove[]) {
    for (const move of moves) {
        switch (move.type) {
            case 'spin': {
                const beginningPrograms = programs.splice(
                    0,
                    programs.length - move.spinAmount,
                );
                programs.push(...beginningPrograms);
                break;
            }
            case 'exchange': {
                const a = programs[move.exchangeA]!;
                programs[move.exchangeA] = programs[move.exchangeB]!;
                programs[move.exchangeB] = a;
                break;
            }
            case 'partner': {
                const iA = programs.indexOf(move.partnerA);
                const iB = programs.indexOf(move.partnerB);
                programs[iA] = move.partnerB;
                programs[iB] = move.partnerA;
                break;
            }
        }
    }
    return programs;
}
