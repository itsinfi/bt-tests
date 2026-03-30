import type { LighthouseStats } from "./types";

function mean(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr: number[]): number {
    const sorted = arr.sort((a, b) => a - b);
    const middleIndex = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
    ? sorted[middleIndex]!
    : (sorted[middleIndex - 1]! + sorted[middleIndex]!) / 2;
}

function stddev(arr: number[]): number {
    const m = mean(arr);
    return Math.sqrt(mean(arr.map(x => (x - m) ** 2)));
}

export function calculateStats(arr: number[]): LighthouseStats {
    return {
        mean: mean(arr),
        median: median(arr),
        stddev: stddev(arr),
    };
}