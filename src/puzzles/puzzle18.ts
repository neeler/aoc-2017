import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import { mod } from '~/util/arithmetic';
import { Registers } from '~/types/Registers';

type InstructionType = 'snd' | 'set' | 'add' | 'mul' | 'mod' | 'rcv' | 'jgz';
interface Instruction {
    type: InstructionType;
    x: number | string;
    y?: number | string;
}

class DuetProgram {
    readonly registers = new Registers();
    readonly instructions: Instruction[];
    readonly partnerId: number;
    readonly programsById: Map<number, DuetProgram>;
    readonly messageQueue: number[] = [];
    iInstruction = 0;
    nMessagesSent = 0;

    constructor({
        id,
        instructions,
        partnerId,
        programsById,
    }: {
        id: number;
        instructions: Instruction[];
        partnerId: number;
        programsById: Map<number, DuetProgram>;
    }) {
        this.registers.set('p', id);
        this.instructions = instructions;
        this.partnerId = partnerId;
        this.programsById = programsById;
    }

    get partner(): DuetProgram {
        return this.programsById.get(this.partnerId)!;
    }

    run(): boolean {
        const instruction = this.instructions[this.iInstruction];
        if (!instruction) {
            return false;
        }
        switch (instruction.type) {
            case 'snd':
                this.partner.messageQueue.push(
                    this.registers.get(instruction.x),
                );
                this.iInstruction++;
                this.nMessagesSent++;
                return true;
            case 'set':
                this.registers.set(
                    instruction.x,
                    this.registers.get(instruction.y),
                );
                this.iInstruction++;
                return true;
            case 'add':
                this.registers.set(
                    instruction.x,
                    this.registers.get(instruction.x) +
                        this.registers.get(instruction.y),
                );
                this.iInstruction++;
                return true;
            case 'mul':
                this.registers.set(
                    instruction.x,
                    this.registers.get(instruction.x) *
                        this.registers.get(instruction.y),
                );
                this.iInstruction++;
                return true;
            case 'mod':
                this.registers.set(
                    instruction.x,
                    mod(
                        this.registers.get(instruction.x),
                        this.registers.get(instruction.y),
                    ),
                );
                this.iInstruction++;
                return true;
            case 'rcv':
                if (this.messageQueue.length > 0) {
                    this.registers.set(
                        instruction.x,
                        this.messageQueue.shift()!,
                    );
                    this.iInstruction++;
                    return true;
                }
                return false;
            case 'jgz':
                if (this.registers.get(instruction.x) > 0) {
                    this.iInstruction += this.registers.get(instruction.y);
                    return true;
                }
                this.iInstruction++;
                return true;
        }
    }
}

export const puzzle18 = new Puzzle({
    day: 18,
    parseInput: (fileData) => {
        return splitFilter(fileData).map((line): Instruction => {
            const [type, x, y] = line.split(' ');
            return {
                type: type as InstructionType,
                x: Number.isNaN(Number(x)) ? x! : Number(x),
                y: Number.isNaN(Number(y)) ? y : Number(y),
            };
        });
    },
    part1: (instructions) => {
        let lastSound = 0;
        let iInstruction = 0;
        const registers = new Registers();

        while (true) {
            const instruction = instructions[iInstruction];
            if (!instruction) {
                break;
            }
            switch (instruction.type) {
                case 'snd':
                    lastSound = registers.get(instruction.x);
                    iInstruction++;
                    break;
                case 'set':
                    registers.set(instruction.x, registers.get(instruction.y));
                    iInstruction++;
                    break;
                case 'add':
                    registers.set(
                        instruction.x,
                        registers.get(instruction.x) +
                            registers.get(instruction.y),
                    );
                    iInstruction++;
                    break;
                case 'mul':
                    registers.set(
                        instruction.x,
                        registers.get(instruction.x) *
                            registers.get(instruction.y),
                    );
                    iInstruction++;
                    break;
                case 'mod':
                    registers.set(
                        instruction.x,
                        mod(
                            registers.get(instruction.x),
                            registers.get(instruction.y),
                        ),
                    );
                    iInstruction++;
                    break;
                case 'rcv':
                    if (registers.get(instruction.x) !== 0) {
                        return lastSound;
                    }
                    iInstruction++;
                    break;
                case 'jgz':
                    if (registers.get(instruction.x) > 0) {
                        iInstruction += registers.get(instruction.y);
                        continue;
                    }
                    iInstruction++;
                    break;
            }
        }

        return 0;
    },
    part2: (instructions) => {
        const programsById = new Map<number, DuetProgram>();
        const program0 = new DuetProgram({
            id: 0,
            instructions,
            partnerId: 1,
            programsById,
        });
        const program1 = new DuetProgram({
            id: 1,
            instructions,
            partnerId: 0,
            programsById,
        });
        programsById.set(0, program0);
        programsById.set(1, program1);

        while (program0.run() || program1.run()) {}

        return program1.nMessagesSent;
    },
});
