import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

class TuringMachine {
    marked = new Map<number, boolean>();
    cursor = 0;
    nChecksumSteps: number;
    states: State[];
    statesById: Map<string, State>;
    currentState: State;

    constructor({
        initInstructions,
        states,
    }: {
        initInstructions: string;
        states: State[];
    }) {
        const [, initialState, nChecksumSteps] = initInstructions!.match(
            /Begin in state (\w).\s+Perform a diagnostic checksum after (\d+) steps./,
        ) as [string, string, string];
        this.nChecksumSteps = Number(nChecksumSteps);
        this.states = states;
        this.statesById = new Map(states.map((state) => [state.id, state]));
        this.currentState = this.statesById.get(initialState)!;
    }

    checksum() {
        for (let i = 0; i < this.nChecksumSteps; i++) {
            const currentValue = this.marked.get(this.cursor) ?? false;
            const { flipBit, move, nextState } =
                this.currentState.conditionsByValue.get(currentValue)!;

            if (flipBit) {
                const nextValue = !currentValue;
                if (nextValue) {
                    this.marked.set(this.cursor, nextValue);
                } else {
                    this.marked.delete(this.cursor);
                }
            }

            this.cursor += move;
            this.currentState = this.statesById.get(nextState)!;
        }
        return this.marked.size;
    }
}

class State {
    id: string;
    conditionsByValue = new Map<boolean, StateCondition>();

    constructor(definition: string) {
        const [, id] = definition.match(/In state (\w)/)!;
        const allConditions = definition.matchAll(
            /If the current value is (\d):\s+- Write the value (\d).\s+- Move one slot to the (\w+).\s+- Continue with state (\w)./g,
        )!;
        this.id = id!;
        for (const condition of allConditions) {
            const [, conditionString, writeString, move, nextState] = condition;
            const conditionValue = Number(conditionString);
            const writeValue = Number(writeString);
            const moveValue = move === 'right' ? 1 : -1;
            this.conditionsByValue.set(conditionValue === 1, {
                condition: conditionValue,
                flipBit: conditionValue !== writeValue,
                move: moveValue,
                nextState: nextState!,
            });
        }
    }
}

interface StateCondition {
    condition: number;
    flipBit: boolean;
    move: number;
    nextState: string;
}

export const puzzle25 = new Puzzle({
    day: 25,
    parseInput: (fileData) => {
        const [initInstructions, ...stateInstructions] = splitFilter(
            fileData,
            '\n\n',
        ) as [string, ...string[]];
        return new TuringMachine({
            initInstructions,
            states: stateInstructions.map(
                (stateInstruction) => new State(stateInstruction),
            ),
        });
    },
    part1: (machine) => {
        return machine.checksum();
    },
    part2: () => {
        return true;
    },
});
