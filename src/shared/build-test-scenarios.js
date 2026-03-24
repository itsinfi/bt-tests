import { config } from './config.js';
import secondsToTimeString from "./seconds-to-time-string.js";
import timeStringToSeconds from './time-string-to-seconds.js';

export default function buildTestScenarios() {
    const scenarios = {};
    let startTime = 0;

    for (const route of config.testRoutes) {
        const cleanRoute = String(route).replace('/', '');

        for (const port of config.appPorts) {
            const baseUrl = `${config.appProtocol}://${config.appHost}:${port}${config.appRoutePrefix}`;

            for (const iterations of config.testIterations) {

                for (const vus of config.testVus) {
                    if (iterations < vus) continue;

                    const scenarioId = `${cleanRoute}_${port}_${iterations}i_${vus}v`;
                    
                    const testName = `test_${port}_${cleanRoute}`;
                    const pauseName = `pause_${port}_${cleanRoute}`;

                    // Test-Szenario:
                    scenarios[`test_${scenarioId}`] = {
                        executor: 'shared-iterations',
                        exec: testName,
                        iterations,
                        vus,
                        startTime: secondsToTimeString(startTime),
                        gracefulStop: config.testGracefulStop,
                        tags: {
                            test_phase: cleanRoute,
                            port: String(port),
                            iterations: String(iterations),
                            vus: String(vus),
                        },
                        env: {
                            CURRENT_ROUTE: cleanRoute,
                            ENDPOINT: `${baseUrl}${route}`,
                            TEST_NAME: testName,
                        }
                    }

                    startTime += timeStringToSeconds(config.testGracefulStop);

                    // Pause:
                    scenarios[`pause_${scenarioId}`] = {
                        executor: 'constant-arrival-rate',
                        exec: 'exec_pause',
                        rate: 1,
                        timeUnit: '1s',
                        duration: config.pauseDuration,
                        preAllocatedVus: 0,
                        maxVUs: 1,
                        startTime: secondsToTimeString(startTime),
                        tags: {
                            test_phase: pauseName,
                            port: String(port),
                        },
                    };

                    startTime += timeStringToSeconds(config.pauseDuration);
                }

            }
        }
    }

    return scenarios;
}
