import { check } from 'k6';
import http from 'k6/http';
import { Counter, Trend } from 'k6/metrics';
import type { Options } from 'k6/options';
import type { Result, ResultData } from './shared/types';

// CONFIG --------------------------------------------------------
if (!__ENV.API_URL || !__ENV.API_AUTH || !__ENV.API_SP_ID || !__ENV.TEST_ITERATIONS || !__ENV.TEST_VUS) {
    console.error('falsche eingabe, kopiere .env.example als .env und gib alle werte an');
    process.exit(1);
}

const API_URL: string = __ENV.API_URL!;
const API_AUTH: string = __ENV.API_AUTH!;
const API_SP_ID: string = __ENV.API_SP_ID!;

const TEST_ITERATIONS: number = parseInt(__ENV.TEST_ITERATIONS!, 10);
const TEST_VUS: number = parseInt(__ENV.TEST_VUS!, 10);
const TEST_MAX_DURATION: string = __ENV.TEST_MAX_DURATION || '2h';
const TEST_GRACEFUL_STOP: string = __ENV.TEST_GRACEFUL_STOP || '0s';

export const options: Options = {
    scenarios: {
        fb1: {
            executor: 'shared-iterations',
            iterations: TEST_ITERATIONS,
            vus: TEST_VUS,
            maxDuration: TEST_MAX_DURATION,
            gracefulStop: TEST_GRACEFUL_STOP,
        }
    }
}

// METRICS --------------------------------------------------------
/**
 * Anzahl beantworteter Fragen (später genutzt für Berechnung des Throughputs)
 */
const anwered = new Counter('answered');

/**
 * Anzahl unbeantworteter Fragen
 */
const unanswered = new Counter('unanswered');

/**
 * Latenz
 */
const latency = new Trend('latency', true);

/**
 * Antwortzeit
 */
const duration = new Trend('duration', true);

// TEST --------------------------------------------------------
export default function () {
    const res = http.get(`${API_URL}/seating-plans/${API_SP_ID}/blocks`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_AUTH}`,
        },
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

// BERICHT --------------------------------------------------------
export function handleSummary({ metrics, state }: ResultData): Record<string, string> {
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
    
    const filename = `/results/fb1-${now}.json`;
    const data = JSON.stringify(summary, null, 4);

    return { [filename]: data };
}