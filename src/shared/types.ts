import type { RequestBody } from "k6/http";
import type { Counter, Trend } from "k6/metrics";

export interface AppConfig {
    API_URL: string;
    API_AUTH: string;
    API_SP_ID: string;
    TEST_ITERATIONS: number;
    TEST_VUS: number;
    TEST_MAX_DURATION: string;
    TEST_GRACEFUL_STOP: string;
    FB_TYPE: FbType;
}

export interface EndpointConfig {
    route: string,
    method: RequestMethod,
    headers: { [name: string]: string },
    payload?: RequestBody,
}

export enum FbType {
    FB1 = 'fb1',
    FB2 = 'fb2',
}

export enum RequestMethod {
    GET,
    POST,
}

export interface Metrics {
    answered: Counter, // Anzahl beantworteter Fragen
    unanswered: Counter, // Anzahl unbeantworteter Fragen
    latency: Trend, // Latenz
    duration: Trend, // Antwortzeit
}

export interface DetailedValue {
    avg: number;
    median: number;
    min: number;
    max: number;
    p95: number;
}

export interface Result {
    time: number;
    answered: number;
    unanswered: number;
    throughput: number;
    latency: DetailedValue;
    duration: DetailedValue;
}

export interface CounterData {
    values: {
        count: number;
    }
}

export interface TrendData {
    values: {
        avg: number;
        med: number;
        min: number;
        max: number;
        'p(95)': number;
    }
}

export interface ResultData {
    metrics: {
        'answered': CounterData | undefined,
        'unanswered': CounterData | undefined,
        'latency': TrendData,
        'duration': TrendData,
    };
    state: { testRunDurationMs: number }
}