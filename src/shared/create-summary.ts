import type { AppConfig, Result, ResultData } from "./types.ts";

export function createSummary({ metrics, state }: ResultData, { FB_TYPE }: AppConfig): Record<string, string> {
    const answered = metrics['answered'] !== undefined ? metrics['answered'].values.count : 0;
    const unanswered = metrics['unanswered'] !== undefined ? metrics['unanswered'].values.count : 0;
    const latency = metrics['latency']!.values;
    const duration = metrics['duration']!.values;
    const time = state.testRunDurationMs / 1000; // in s
    const throughput = answered / time; // in req/s

    const summary: Result = {
        time,
        answered,
        unanswered,
        throughput,
        latency: {
            avg: latency.avg,
            median: latency.med,
            min: latency.min,
            max: latency.max,
            p95: latency['p(95)'],
        },
        duration: {
            avg: duration.avg,
            median: duration.med,
            min: duration.min,
            max: duration.max,
            p95: duration['p(95)'],
        },
    };

    const now = (new Date().toISOString().split('.')[0] ?? '')
        .toString().replace(/:/g, '-');
    
    const filename = `/results/${FB_TYPE}-${now}.json`;
    const data = JSON.stringify(summary, null, 4);

    return { [filename]: data };
}