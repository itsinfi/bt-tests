export const config = {
    appProtocol: String(__ENV.APP_PROTOCOL ?? 'http'),
    appHost: String(__ENV.APP_HOST ?? 'localhost'),
    appPorts: __ENV.APP_PORTS?.split('|') ?? ['3000'],
    appRoutePrefix: String(__ENV.APP_ROUTE_PREFIX ?? ''),

    testRoutes: __ENV.TEST_ROUTES?.split('|') ?? ['/01'],
    testIterations: __ENV.TEST_ITERATIONS?.split('|')?.map(v => Number(v)) ?? [10, 25, 50, 100],
    testVus: __ENV.TEST_VUS?.split('|')?.map(v => Number(v)) ?? [5, 10, 15, 25],
    testGracefulStop: String(__ENV.TEST_GRACEFUL_STOP ?? '10s'),

    pauseDuration: String(__ENV.PAUSE_DURATION ?? '30s'),
};