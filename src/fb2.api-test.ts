import type { Options } from 'k6/options';
import { FbType, RequestMethod, type EndpointConfig, type ResultData } from './shared/types.ts';
import { SharedArray } from 'k6/data';
import { createSummary } from './shared/create-summary.ts';
import { performTest } from './shared/perform-test.ts';
import { loadAppConfig } from './shared/load-app-config.ts';
import { setOptions } from './shared/set-options.ts';
import { createMetrics } from './shared/create-metrics.ts';
import { scenario } from 'k6/execution';;
import { STRIPE_DATA } from './data/stripe-data.ts';

// KONFIGURATION --------------------------------------------------------
const appConfig = loadAppConfig(FbType.FB2);

const baseEndpointConfig: EndpointConfig = {
    route: '/webhook',
    method: RequestMethod.POST,
    headers: {
        'Content-Type': 'application/json',
    }
};

// K6-PARAMETER --------------------------------------------------------
export const options: Options = setOptions(appConfig);

// METRIKEN --------------------------------------------------------
const metrics = createMetrics();

// TEST --------------------------------------------------------
const stripeData = new SharedArray('fb2-stripe-data', () => STRIPE_DATA);

export default function () {
    const index = scenario.iterationInTest;
    const stripeDataObject = stripeData[index] as unknown as { header: string, payload: string };

    if (!stripeDataObject || !stripeDataObject?.header || !stripeDataObject?.payload) {
        console.warn('no more unique stripe ids, will quit test...');
        return;
    }

    const { header, payload } = stripeDataObject;

    const headers = {
        ...baseEndpointConfig.headers,
        'Stripe-Signature': header,
    };

    const endpointConfig = {
        ...baseEndpointConfig,
        headers,
        payload,
    };

    performTest(metrics, endpointConfig, appConfig);
}

// BERICHT --------------------------------------------------------
export function handleSummary(data: ResultData): Record<string, string> {
    return createSummary(data, appConfig)
}