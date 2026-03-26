import http, { type RefinedParams, type RefinedResponse, type RequestBody, type ResponseType } from "k6/http";
import { RequestMethod, type AppConfig, type EndpointConfig, type Metrics } from "./types.ts";
import { saveMetrics } from "./save-metrics.ts";

export function performTest(
    metrics: Metrics,
    endpointConfig: EndpointConfig,
    appConfig: AppConfig,
) {
    const url: string = `${appConfig.API_URL}${endpointConfig.route}`;
    
    const params: RefinedParams<ResponseType> = {
        headers: endpointConfig.headers,
    };

    switch (endpointConfig.method) {
        
        case RequestMethod.GET: {
            const res: RefinedResponse<ResponseType> = http.get(url, params);
            saveMetrics(res, metrics);
            break;
        }
            
        case RequestMethod.POST: {
            const res: RefinedResponse<ResponseType> = http.post(
                url, endpointConfig.payload, params
            );
            saveMetrics(res, metrics);
            break;
        }
    }
}