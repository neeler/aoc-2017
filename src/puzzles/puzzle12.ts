import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import { Graph, GraphNode } from '~/types/Graph';
import { Queue } from '~/types/Queue';
import { CustomSet } from '~/types/CustomSet';

export const puzzle12 = new Puzzle({
    day: 12,
    parseInput: (fileData) => {
        const graph = new Graph();
        splitFilter(fileData).forEach((line) => {
            const [node, neighbors] = line.split(' <-> ') as [string, string];
            const nodeA = graph.addNodeByName(node);
            neighbors.split(', ').forEach((neighbor) => {
                const nodeB = graph.addNodeByName(neighbor);
                graph.linkNodes(nodeA, nodeB, 1);
            });
        });
        return graph;
    },
    part1: (graph) => {
        return getGroupContaining(graph.getNodeByName('0')!).size;
    },
    part2: (graph) => {
        const groupsByNode = new Map<GraphNode, Set<GraphNode>>();
        const groupsSeen = new CustomSet<Set<GraphNode>>({
            getKey: (group) =>
                Array.from(group)
                    .map((node) => node.name)
                    .sort()
                    .join(','),
        });
        for (const node of graph.nodes) {
            const group = getGroupContaining(node, groupsByNode);
            groupsSeen.add(group);
        }
        return groupsSeen.size;
    },
});

function getGroupContaining(
    target: GraphNode,
    groupsByNode?: Map<GraphNode, Set<GraphNode>>,
): Set<GraphNode> {
    const cachedGroup = groupsByNode?.get(target);
    if (cachedGroup) {
        return cachedGroup;
    }

    const group = new Set<GraphNode>();
    const queue = new Queue<GraphNode>();
    queue.add(target);
    queue.process((node) => {
        group.add(node);
        node.neighbors.forEach((neighbor) => {
            if (!group.has(neighbor)) {
                queue.add(neighbor);
            }
        });
    });
    if (groupsByNode) {
        for (const node of group) {
            groupsByNode?.set(node, group);
        }
    }
    return group;
}
