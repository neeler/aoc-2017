import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import { sum } from '~/util/arithmetic';

export const puzzle7 = new Puzzle({
    day: 7,
    parseInput: (fileData) => {
        const nodes = new Set<string>();
        const discSizes = new Map<string, number>();
        const childNodes = new Map<string, Set<string>>();
        const parentNodes = new Map<string, string>();

        splitFilter(fileData).forEach((line) => {
            const [node, children] = line.split(' -> ');
            const [, nodeName, size] = node!.match(/(\w+) \((\d+)\)/) as [
                string,
                string,
                string,
            ];
            nodes.add(nodeName);
            discSizes.set(nodeName, Number(size));
            if (children) {
                const childNames = children.split(', ');
                childNodes.set(nodeName, new Set(childNames));
                for (const childName of childNames) {
                    nodes.add(childName);
                    parentNodes.set(childName, nodeName);
                }
            }
        });

        return {
            nodes,
            discSizes,
            parentNodes,
            childNodes,
        };
    },
    part1: ({ nodes, parentNodes }) => {
        return [...nodes].find((node) => !parentNodes.has(node))!;
    },
    part2: ({ nodes, childNodes, discSizes }) => {
        const sumTower = (
            node: string,
            discSizes: Map<string, number>,
        ): number => {
            const discSize = discSizes.get(node)!;
            const children = childNodes.get(node);
            if (!children) {
                return discSize;
            }
            const childSizes = Array.from(children).map((child) =>
                sumTower(child, discSizes),
            );
            return discSize + sum(childSizes);
        };

        const isBalanced = (
            node: string,
            discSizes: Map<string, number>,
        ): boolean => {
            const children = childNodes.get(node);
            if (!children) {
                return true;
            }
            const childArray = Array.from(children);
            const childSizes = childArray.map((child) =>
                sumTower(child, discSizes),
            );
            const sumOfChildren = sum(childSizes);
            const equalBalance = Math.round(sumOfChildren / childSizes.length);
            const childrenAreBalanced = childSizes.every(
                (size) => size === equalBalance,
            );
            return (
                childrenAreBalanced &&
                childArray.every((child) => isBalanced(child, discSizes))
            );
        };

        const unbalancedNodes: string[] = [];
        const unbalancedSet = new Set(unbalancedNodes);
        for (const node of nodes) {
            if (!isBalanced(node, discSizes)) {
                unbalancedNodes.push(node);
            }
        }

        if (unbalancedNodes.length === 0) {
            throw new Error('No unbalanced nodes found');
        }

        const problemParent =
            unbalancedNodes.length === 1
                ? unbalancedNodes[0]!
                : unbalancedNodes.find((node) => {
                      const children = childNodes.get(node);

                      if (!children) {
                          return true;
                      }

                      return Array.from(children).every(
                          (child) => !unbalancedSet.has(child),
                      );
                  });

        if (!problemParent) {
            throw new Error('No problem parent found');
        }

        const children = childNodes.get(problemParent)!;
        const childArray = Array.from(children);
        const childSizes = childArray.map((child) =>
            sumTower(child, discSizes),
        );
        const weightCounts = new Map<number, number>();
        for (const size of childSizes) {
            const count = weightCounts.get(size) ?? 0;
            weightCounts.set(size, count + 1);
        }
        const healthyTowerWeight = [...weightCounts.entries()].find(
            ([, count]) => count > 1,
        )![0];
        const problemChild = childArray.find(
            (child) => weightCounts.get(sumTower(child, discSizes)) === 1,
        );
        const problemWeight = sumTower(problemChild!, discSizes);

        if (!problemChild) {
            throw new Error('No problem child found');
        }

        return (
            discSizes.get(problemChild)! - (problemWeight - healthyTowerWeight)
        );
    },
});
