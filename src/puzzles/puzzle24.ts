import { Puzzle } from './Puzzle';
import { getNumbers, splitFilter } from '~/util/parsing';
import { sum } from '~/util/arithmetic';

class Component {
    id: string;
    ports: number[];
    strength: number;

    constructor(id: string) {
        this.id = id;
        this.ports = getNumbers(id);
        this.strength = sum(this.ports);
    }
}

interface Bridge {
    usedComponents: Set<Component>;
    strength: number;
}

export const puzzle24 = new Puzzle({
    day: 24,
    parseInput: (fileData) => {
        const components = splitFilter(fileData).map(
            (line) => new Component(line),
        );
        const componentsByPort = new Map<number, Set<Component>>();
        components.forEach((component) => {
            component.ports.forEach((port) => {
                const existing = componentsByPort.get(port) ?? new Set();
                existing.add(component);
                componentsByPort.set(port, existing);
            });
        });
        return {
            components,
            componentsByPort,
        };
    },
    part1: ({ componentsByPort }) => {
        let maxStrength = 0;
        for (const bridge of buildBridges({
            componentsByPort,
            usedComponents: new Set(),
            exposedPort: 0,
            strength: 0,
        })) {
            maxStrength = Math.max(maxStrength, bridge.strength);
        }
        return maxStrength;
    },
    part2: ({ componentsByPort }) => {
        let maxStrengthOfLongest = 0;
        let longestLength = 0;
        for (const bridge of buildBridges({
            componentsByPort,
            usedComponents: new Set(),
            exposedPort: 0,
            strength: 0,
        })) {
            if (bridge.usedComponents.size > longestLength) {
                longestLength = bridge.usedComponents.size;
                maxStrengthOfLongest = bridge.strength;
            } else if (bridge.usedComponents.size === longestLength) {
                maxStrengthOfLongest = Math.max(
                    maxStrengthOfLongest,
                    bridge.strength,
                );
            }
        }
        return maxStrengthOfLongest;
    },
});

function* buildBridges({
    componentsByPort,
    usedComponents,
    exposedPort,
    strength,
}: {
    componentsByPort: Map<number, Set<Component>>;
    usedComponents: Set<Component>;
    exposedPort: number;
    strength: number;
}): Generator<Bridge> {
    for (const component of componentsByPort.get(exposedPort)!) {
        if (!usedComponents.has(component)) {
            const newComponents = new Set(usedComponents);
            newComponents.add(component);
            yield* buildBridges({
                componentsByPort,
                usedComponents: newComponents,
                exposedPort: component.strength - exposedPort,
                strength: strength + component.strength,
            });
        }
    }

    yield {
        usedComponents,
        strength,
    };
}
