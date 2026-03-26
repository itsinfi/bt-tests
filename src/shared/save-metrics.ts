import { check } from "k6";
import type { Metrics } from "./types";
import type { RefinedResponse, ResponseType } from "k6/http";

export function saveMetrics(res: RefinedResponse<ResponseType>, metrics: Metrics) {
    const isOK: boolean = check(res, {
        'is status 200': (r) => r.status === 200,
    });

    if (isOK) {
        metrics.answered.add(1);
    } else {
        metrics.unanswered.add(1);
    }

    metrics.latency.add(res.timings.waiting);
    metrics.duration.add(res.timings.duration);
}