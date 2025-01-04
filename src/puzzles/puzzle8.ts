import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

type Action = 'inc' | 'dec';
type Comparator = '>' | '<' | '>=' | '<=' | '!=' | '==';

interface Instruction {
    targetRegister: string;
    action: Action;
    amount: number;
    conditionRegister: string;
    comparator: Comparator;
    compareValue: number;
}

export const puzzle8 = new Puzzle({
    day: 8,
    parseInput: (fileData) => {
        return splitFilter(fileData).map((line): Instruction => {
            const [
                ,
                targetRegister,
                action,
                amount,
                conditionRegister,
                comparator,
                compareValue,
            ] = line.match(
                /(\w+) (inc|dec) (-?\d+) if (\w+) (>|<|>=|<=|!=|==) (-?\d+)/,
            ) as [string, string, string, string, string, string, string];
            return {
                targetRegister,
                action: action as Action,
                amount: Number(amount),
                conditionRegister,
                comparator: comparator as Comparator,
                compareValue: Number(compareValue),
            };
        });
    },
    part1: (instructions) => {
        const registers = new Map<string, number>();
        for (const instruction of instructions) {
            let registerValue = registers.get(instruction.targetRegister) ?? 0;
            if (passesCondition(instruction, registers)) {
                registerValue +=
                    instruction.action === 'inc'
                        ? instruction.amount
                        : -instruction.amount;
            }
            registers.set(instruction.targetRegister, registerValue);
        }
        return Math.max(...Array.from(registers).map(([, value]) => value));
    },
    part2: (instructions) => {
        const registers = new Map<string, number>();
        let maxSeen = 0;
        for (const instruction of instructions) {
            let registerValue = registers.get(instruction.targetRegister) ?? 0;
            if (passesCondition(instruction, registers)) {
                registerValue +=
                    instruction.action === 'inc'
                        ? instruction.amount
                        : -instruction.amount;
            }
            registers.set(instruction.targetRegister, registerValue);
            if (registerValue > maxSeen) {
                maxSeen = registerValue;
            }
        }
        return maxSeen;
    },
});

function passesCondition(
    { conditionRegister, comparator, compareValue }: Instruction,
    registers: Map<string, number>,
): boolean {
    const value = registers.get(conditionRegister) ?? 0;
    registers.set(conditionRegister, value);

    switch (comparator) {
        case '>':
            return value > compareValue;
        case '<':
            return value < compareValue;
        case '>=':
            return value >= compareValue;
        case '<=':
            return value <= compareValue;
        case '==':
            return value == compareValue;
        case '!=':
            return value != compareValue;
    }
}
