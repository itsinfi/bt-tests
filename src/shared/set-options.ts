import type { Options } from "k6/options";
import type { AppConfig, FbType } from "./types.ts";

export function setOptions(appConfig: AppConfig): Options {
    return {
        scenarios: {
            [appConfig.FB_TYPE]: {
                executor: 'shared-iterations',
                iterations: appConfig.TEST_ITERATIONS,
                vus: appConfig.TEST_VUS,
                maxDuration: appConfig.TEST_MAX_DURATION,
                gracefulStop: appConfig.TEST_GRACEFUL_STOP,
            }
        }
    }
}