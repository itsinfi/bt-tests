import type { Options } from 'k6/options';
import { FbType, RequestMethod, type EndpointConfig, type ResultData } from './shared/types.ts';
import { loadAppConfig } from './shared/load-app-config.ts';
import { setOptions } from './shared/set-options.ts';
import { createMetrics } from './shared/create-metrics.ts';
import { performTest } from './shared/perform-test.ts';
import { createSummary } from './shared/create-summary.ts';

// KONFIGURATION --------------------------------------------------------
const appConfig = loadAppConfig(FbType.FB1);

const endpointConfig: EndpointConfig = {
    route: `/seating-plans/${appConfig.API_SP_ID}/blocks`,
    method: RequestMethod.GET,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${appConfig.API_AUTH}`,
    },
};

// K6-OPTIONEN --------------------------------------------------------
export const options: Options = setOptions(appConfig);

// METRIKEN --------------------------------------------------------
const metrics = createMetrics();

// TEST --------------------------------------------------------
export default function () {
    performTest(metrics, endpointConfig, appConfig);
}

// BERICHT --------------------------------------------------------
export function handleSummary(data: ResultData): Record<string, string> {
    return createSummary(data, appConfig)
}