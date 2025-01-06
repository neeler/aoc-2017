export class Registers {
    values = new Map<string, number>();

    get(target: number | string | undefined): number {
        if (target === undefined) {
            throw new Error('Cannot get an undefined register');
        }
        return typeof target === 'number'
            ? target
            : (this.values.get(target) ?? 0);
    }

    set(target: number | string | undefined, value: number): void {
        if (typeof target !== 'string') {
            throw new Error('Cannot set a number as a register');
        }
        this.values.set(target, value);
    }
}
