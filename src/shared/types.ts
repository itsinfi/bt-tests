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