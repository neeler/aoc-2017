import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import { Registers } from '~/types/Registers';

type InstructionType = 'set' | 'sub' | 'mul' | 'jnz';
interface Instruction {
    op: InstructionType;
    x: number | string;
    y: number | string;
}

class Coprocessor {
    readonly registers = new Registers();
    readonly instructions: Instruction[];
    iInstruction = 0;

    constructor({ instructions }: { instructions: Instruction[] }) {
        'abcdefgh'.split('').forEach((r) => this.registers.set(r, 0));
        this.instructions = instructions;
    }

    run(onInstruction?: (instruction: Instruction) => void) {
        while (this.runNext(onInstruction)) {}
    }

    runNext(onInstruction?: (instruction: Instruction) => void): boolean {
        const instruction = this.instructions[this.iInstruction];
        if (!instruction) {
            return false;
        }
        onInstruction?.(instruction);

        switch (instruction.op) {
            case 'set':
                this.registers.set(
                    instruction.x,
                    this.registers.get(instruction.y),
                );
                this.iInstruction++;
                break;
            case 'sub':
                this.registers.set(
                    instruction.x,
                    this.registers.get(instruction.x) -
                        this.registers.get(instruction.y),
                );
                this.iInstruction++;
                break;
            case 'mul':
                this.registers.set(
                    instruction.x,
                    this.registers.get(instruction.x) *
                        this.registers.get(instruction.y),
                );
                this.iInstruction++;
                break;
            case 'jnz':
                if (this.registers.get(instruction.x) != 0) {
                    this.iInstruction += this.registers.get(instruction.y);
                    break;
                }
                this.iInstruction++;
                break;
        }
        return true;
    }
}

export const puzzle23 = new Puzzle({
    day: 23,
    parseInput: (fileData) => {
        return splitFilter(fileData).map((line): Instruction => {
            const [type, x, y] = line.split(' ');
            return {
                op: type as InstructionType,
                x: Number.isNaN(Number(x)) ? x! : Number(x),
                y: Number.isNaN(Number(y)) ? y! : Number(y),
            };
        });
    },
    part1: (instructions) => {
        const coprocessor = new Coprocessor({
            instructions,
        });
        let mulCount = 0;
        coprocessor.run((instruction) => {
            if (instruction.op === 'mul') {
                mulCount++;
            }
        });
        return mulCount;
    },
    part2: (instructions) => {
        const coprocessor = new Coprocessor({
            instructions: instructions.slice(0, 8),
        });
        coprocessor.registers.set('a', 1);
        coprocessor.run();

        const initialB = coprocessor.registers.get('b');
        const initialC = coprocessor.registers.get('c');
        const increment = -Number(instructions[instructions.length - 2]!.y);

        // Count the non-prime numbers between b and c, inclusive,
        // stepping by the increment

        let h = 0;

        for (let b = initialB; b <= initialC; b += increment) {
            for (let factor = 2; factor < b; factor++) {
                if (b % factor === 0) {
                    h++;
                    break;
                }
            }
        }

        return h;
    },
});
