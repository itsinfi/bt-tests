import { check } from 'k6';
import http from 'k6/http';
import { Counter, Trend } from 'k6/metrics';
import type { Options } from 'k6/options';
import type { Result, ResultData } from './shared/types';

const API_URL: string = __ENV.API_URL!;
const TEST_ITERATIONS: number = Number.parseInt(__ENV.TEST_ITERATIONS!);
const TEST_VUS: number = Number.parseInt(__ENV.TEST_VUS!);

export const options: Options = {
    iterations: TEST_ITERATIONS,
    vus: TEST_VUS,
}

const anwered = new Counter('answered');
const unanswered = new Counter('unanswered');

const latency = new Trend('latency', true);
const duration = new Trend('duration', true);

export default function () {
    const res = http.get(API_URL, {
        headers: { 'Content-Type': 'application/json' },
    });

    const isOK = check(res, {
        'is status 200': (r) => r.status === 200,
    });

    if (isOK) {
        anwered.add(1);
    } else {
        unanswered.add(1);
    }

    latency.add(res.timings.waiting);
    duration.add(res.timings.duration);
}

export function handleSummary({ metrics, state }: ResultData): Record<string, string> {
    const answered = metrics['answered'] !== undefined ? metrics['answered'].values.count : 0;
    const unanswered = metrics['unanswered'] !== undefined ? metrics['unanswered'].values.count : 0;
    const latency = metrics['latency']!.values;
    const duration = metrics['duration']!.values;
    const time = state.testRunDurationMs;
    const throughput = answered / time / 1000;

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

    const now = new Date()
        .toISOString()
        .split('.')[0]
        .toString()
        .replace(/:/g, '-');
    
    const filename = `/results/${now}.json`;
    const data = JSON.stringify(summary, null, 4);

    return { [filename]: data };
}