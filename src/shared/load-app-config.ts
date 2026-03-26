import type { AppConfig, FbType } from "./types.ts";

export function loadAppConfig(fbType: FbType): AppConfig {
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

    const config: AppConfig = {
        API_URL, API_AUTH, API_SP_ID,
        TEST_ITERATIONS, TEST_VUS, TEST_MAX_DURATION, TEST_GRACEFUL_STOP,
        FB_TYPE: fbType,
    };

    return config;
}