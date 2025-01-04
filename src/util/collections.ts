export function indexToItemMap<T>(array: T[]) {
    return array.reduce((map, value, index) => {
        map.set(index, value);
        return map;
    }, new Map<number, T>());
}

export function itemToIndexMap<T>(array: T[]) {
    return array.reduce((map, value, index) => {
        map.set(value, index);
        return map;
    }, new Map<T, number>());
}

export function arrayToCountMap<T>(array: T[]): Map<T, number> {
    return array.reduce((map, value) => {
        map.set(value, (map.get(value) ?? 0) + 1);
        return map;
    }, new Map<T, number>());
}

export function middleItem<T>(array: T[]): T {
    if (!array.length) {
        throw new Error('Array is empty');
    }
    return array[Math.floor(array.length / 2)]!;
}

export class MapOfArrays<K, D> extends Map<K, D[]> {
    addToKey(key: K, data: D) {
        if (!this.has(key)) {
            this.set(key, []);
        }
        this.get(key)!.push(data);
    }
}

export function chunk<T>(array: T[], size: number) {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
