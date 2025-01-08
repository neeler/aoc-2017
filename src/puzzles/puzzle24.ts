import { Puzzle } from './Puzzle';
import { getNumbers, splitFilter } from '~/util/parsing';
import { Queue } from '~/types/Queue';
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

export const puzzle24 = new Puzzle({
    day: 24,
    parseInput: (fileData) => {
        return splitFilter(fileData).map((line) => new Component(line));
    },
    part1: (components) => {
        const queue = new Queue<{
            usedComponents: Set<Component>;
            exposedPort: number;
            strength: number;
        }>();
        const componentsByPort = new Map<number, Set<Component>>();
        components.forEach((component) => {
            component.ports.forEach((port) => {
                const existing = componentsByPort.get(port) ?? new Set();
                existing.add(component);
                componentsByPort.set(port, existing);
            });
            if (component.ports.includes(0)) {
                queue.add({
                    usedComponents: new Set([component]),
                    exposedPort: component.strength,
                    strength: component.strength,
                });
            }
        });
        let maxStrength = 0;
        queue.process(({ usedComponents, exposedPort, strength }) => {
            maxStrength = Math.max(maxStrength, strength);
            for (const component of componentsByPort.get(exposedPort)!) {
                if (!usedComponents.has(component)) {
                    const newComponents = new Set(usedComponents);
                    newComponents.add(component);
                    queue.add({
                        usedComponents: newComponents,
                        exposedPort: component.strength - exposedPort,
                        strength: strength + component.strength,
                    });
                }
            }
        });
        return maxStrength;
    },
    part2: (components) => {
        const queue = new Queue<{
            usedComponents: Set<Component>;
            exposedPort: number;
            strength: number;
        }>();
        const componentsByPort = new Map<number, Set<Component>>();
        components.forEach((component) => {
            component.ports.forEach((port) => {
                const existing = componentsByPort.get(port) ?? new Set();
                existing.add(component);
                componentsByPort.set(port, existing);
            });
            if (component.ports.includes(0)) {
                queue.add({
                    usedComponents: new Set([component]),
                    exposedPort: component.strength,
                    strength: component.strength,
                });
            }
        });
        let maxStrengthOfLongest = 0;
        let longestLength = 0;
        queue.process(({ usedComponents, exposedPort, strength }) => {
            if (usedComponents.size > longestLength) {
                longestLength = usedComponents.size;
                maxStrengthOfLongest = strength;
            } else if (usedComponents.size === longestLength) {
                maxStrengthOfLongest = Math.max(maxStrengthOfLongest, strength);
            }
            for (const component of componentsByPort.get(exposedPort)!) {
                if (!usedComponents.has(component)) {
                    const newComponents = new Set(usedComponents);
                    newComponents.add(component);
                    queue.add({
                        usedComponents: newComponents,
                        exposedPort: component.strength - exposedPort,
                        strength: strength + component.strength,
                    });
                }
            }
        });
        return maxStrengthOfLongest;
    },
});
