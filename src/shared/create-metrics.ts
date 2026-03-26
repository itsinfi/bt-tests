import { Counter, Trend } from "k6/metrics";
import type { Metrics } from "./types.ts";

export function createMetrics(): Metrics {
    /**
     * Anzahl beantworteter Fragen (später genutzt für Berechnung des Throughputs)
     */
    const answered = new Counter('answered');

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

    return { answered, unanswered, latency, duration };
}