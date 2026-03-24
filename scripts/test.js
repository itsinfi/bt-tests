import { check, group } from 'k6';
import http from 'k6/http';
import { Trend, Counter, Rate, Gauge } from 'k6/metrics';
import buildTestScenarios from './utils/build-test-scenarios.js';
import loadBodyDefinitions from './utils/load-body-definitions.js';
import { saveSummary } from './utils/save-summary.js';

const scenarios = buildTestScenarios();

const bodyDefinitions = loadBodyDefinitions();

const groupMetrics = {};
const groups = Object.keys(scenarios);

groups.forEach(groupKey => {
    const groupName = scenarios[groupKey]?.exec ?? '';

    if (!groupMetrics[groupName]) {
        groupMetrics[groupName] = {
            iterations: new Counter(`iterations_${groupName}`),
            // data_received: new Counter(`data_received_${groupName}`),
            // data_sent: new Counter(`data_sent_${groupName}`),
            http_reqs: new Counter(`http_reqs_${groupName}`),
            http_req_duration: new Trend(`http_req_duration_${groupName}`),
            http_req_waiting: new Trend(`http_req_waiting_${groupName}`),
            http_req_blocked: new Trend(`http_req_blocked_${groupName}`),
            http_req_failed: new Rate(`http_req_failed_${groupName}`),
            http_req_tls_handshaking: new Trend(`http_req_tls_handshaking_${groupName}`),
            http_req_receiving: new Trend(`http_req_receiving_${groupName}`),
            http_req_sending: new Trend(`http_req_sending_${groupName}`),
            http_req_connecting: new Trend(`http_req_connecting_${groupName}`),
            processing_time: new Trend(`processing_time_${groupName}`),
            vus: new Gauge(`vus_${groupName}`),
            checks: new Rate(`checks_${groupName}`),
            total_duration: new Counter(`total_duration_${groupName}`),
        };
    }
});

export const options = {
    maxRedirects: 0,
    discardResponseBodies: true,
    scenarios
}

export function exec_pause() { }

export function exec_test() {
    const payload = JSON.stringify(bodyDefinitions[__ENV.CURRENT_ROUTE]);
    const params = { headers: { 'Content-Type': 'application/json' } };

    const res = http.post(__ENV.ENDPOINT, payload, params);

    groupMetrics[__ENV.TEST_NAME].iterations.add(1);
    // groupMetrics[__ENV.TEST_NAME].data_received.add((res.body.length / 1024).toFixed(2));
    // groupMetrics[__ENV.TEST_NAME].data_sent.add(res.request.body ? (res.request.body.length / 1024).toFixed(2) : 0);
    groupMetrics[__ENV.TEST_NAME].http_reqs.add(1);
    groupMetrics[__ENV.TEST_NAME].http_req_duration.add(res.timings.duration);
    groupMetrics[__ENV.TEST_NAME].http_req_waiting.add(res.timings.waiting);
    groupMetrics[__ENV.TEST_NAME].http_req_blocked.add(res.timings.blocked);
    groupMetrics[__ENV.TEST_NAME].http_req_failed.add(res.status !== 200);
    groupMetrics[__ENV.TEST_NAME].http_req_tls_handshaking.add(res.timings.tls_handshaking);
    groupMetrics[__ENV.TEST_NAME].http_req_receiving.add(res.timings.receiving);
    groupMetrics[__ENV.TEST_NAME].http_req_sending.add(res.timings.sending);
    groupMetrics[__ENV.TEST_NAME].http_req_connecting.add(res.timings.connecting);
    groupMetrics[__ENV.TEST_NAME].vus.add(__VU);
    groupMetrics[__ENV.TEST_NAME].checks.add(check(res, { 'is status 200': (r) => r.status === 200 }));
    groupMetrics[__ENV.TEST_NAME].processing_time.add(res.headers['Processing-Time'] ?? 0);
    groupMetrics[__ENV.TEST_NAME].total_duration.add(res.timings.duration);
}

export const handleSummary = (data) => saveSummary(data, groupMetrics);

export const test_3000_01 = () => group('test_3000_01', exec_test);
export const test_3000_01_multi = () => group('test_3000_01_multi', exec_test);
export const test_3001_01 = () => group('test_3001_01', exec_test);
export const test_3001_01_multi = () => group('test_3001_01_multi', exec_test);
export const test_3002_01 = () => group('test_3002_01', exec_test);
export const test_3002_01_multi = () => group('test_3002_01_multi', exec_test);
export const test_3003_01 = () => group('test_3003_01', exec_test);
export const test_3003_01_multi = () => group('test_3003_01_multi', exec_test);

export const test_3000_02 = () => group('test_3000_02', exec_test);
export const test_3000_02_multi = () => group('test_3000_02_multi', exec_test);
export const test_3001_02 = () => group('test_3001_02', exec_test);
export const test_3001_02_multi = () => group('test_3001_02_multi', exec_test);
export const test_3002_02 = () => group('test_3002_02', exec_test);
export const test_3002_02_multi = () => group('test_3002_02_multi', exec_test);
export const test_3003_02 = () => group('test_3003_02', exec_test);
export const test_3003_02_multi = () => group('test_3003_02_multi', exec_test);

export const test_3000_03 = () => group('test_3000_03', exec_test);
export const test_3000_03_multi = () => group('test_3000_03_multi', exec_test);
export const test_3001_03 = () => group('test_3001_03', exec_test);
export const test_3001_03_multi = () => group('test_3001_03_multi', exec_test);
export const test_3002_03 = () => group('test_3002_03', exec_test);
export const test_3002_03_multi = () => group('test_3002_03_multi', exec_test);
export const test_3003_03 = () => group('test_3003_03', exec_test);
export const test_3003_03_multi = () => group('test_3003_03_multi', exec_test);

export const test_3000_04 = () => group('test_3000_04', exec_test);
export const test_3000_04_multi = () => group('test_3000_04_multi', exec_test);
export const test_3001_04 = () => group('test_3001_04', exec_test);
export const test_3001_04_multi = () => group('test_3001_04_multi', exec_test);
export const test_3002_04 = () => group('test_3002_04', exec_test);
export const test_3002_04_multi = () => group('test_3002_04_multi', exec_test);
export const test_3003_04 = () => group('test_3003_04', exec_test);
export const test_3003_04_multi = () => group('test_3003_04_multi', exec_test);

export const test_3000_05 = () => group('test_3000_05', exec_test);
export const test_3000_05_multi = () => group('test_3000_05_multi', exec_test);
export const test_3001_05 = () => group('test_3001_05', exec_test);
export const test_3001_05_multi = () => group('test_3001_05_multi', exec_test);
export const test_3002_05 = () => group('test_3002_05', exec_test);
export const test_3002_05_multi = () => group('test_3002_05_multi', exec_test);
export const test_3003_05 = () => group('test_3003_05', exec_test);
export const test_3003_05_multi = () => group('test_3003_05_multi', exec_test);

export const test_3000_06 = () => group('test_3000_06', exec_test);
export const test_3000_06_multi = () => group('test_3000_06_multi', exec_test);
export const test_3001_06 = () => group('test_3001_06', exec_test);
export const test_3001_06_multi = () => group('test_3001_06_multi', exec_test);
export const test_3002_06 = () => group('test_3002_06', exec_test);
export const test_3002_06_multi = () => group('test_3002_06_multi', exec_test);
export const test_3003_06 = () => group('test_3003_06', exec_test);
export const test_3003_06_multi = () => group('test_3003_06_multi', exec_test);

export const test_3000_07 = () => group('test_3000_07', exec_test);
export const test_3000_07_multi = () => group('test_3000_07_multi', exec_test);
export const test_3001_07 = () => group('test_3001_07', exec_test);
export const test_3001_07_multi = () => group('test_3001_07_multi', exec_test);
export const test_3002_07 = () => group('test_3002_07', exec_test);
export const test_3002_07_multi = () => group('test_3002_07_multi', exec_test);
export const test_3003_07 = () => group('test_3003_07', exec_test);
export const test_3003_07_multi = () => group('test_3003_07_multi', exec_test);

export const test_3000_08 = () => group('test_3000_08', exec_test);
export const test_3000_08_multi = () => group('test_3000_08_multi', exec_test);
export const test_3001_08 = () => group('test_3001_08', exec_test);
export const test_3001_08_multi = () => group('test_3001_08_multi', exec_test);
export const test_3002_08 = () => group('test_3002_08', exec_test);
export const test_3002_08_multi = () => group('test_3002_08_multi', exec_test);
export const test_3003_08 = () => group('test_3003_08', exec_test);
export const test_3003_08_multi = () => group('test_3003_08_multi', exec_test);

export const test_3000_09 = () => group('test_3000_09', exec_test);
export const test_3000_09_multi = () => group('test_3000_09_multi', exec_test);
export const test_3001_09 = () => group('test_3001_09', exec_test);
export const test_3001_09_multi = () => group('test_3001_09_multi', exec_test);
export const test_3002_09 = () => group('test_3002_09', exec_test);
export const test_3002_09_multi = () => group('test_3002_09_multi', exec_test);
export const test_3003_09 = () => group('test_3003_09', exec_test);
export const test_3003_09_multi = () => group('test_3003_09_multi', exec_test);

export const test_3000_10 = () => group('test_3000_10', exec_test);
export const test_3000_10_multi = () => group('test_3000_10_multi', exec_test);
export const test_3001_10 = () => group('test_3001_10', exec_test);
export const test_3001_10_multi = () => group('test_3001_10_multi', exec_test);
export const test_3002_10 = () => group('test_3002_10', exec_test);
export const test_3002_10_multi = () => group('test_3002_10_multi', exec_test);
export const test_3003_10 = () => group('test_3003_10', exec_test);
export const test_3003_10_multi = () => group('test_3003_10_multi', exec_test);

export const test_3000_11 = () => group('test_3000_11', exec_test);
export const test_3000_11_multi = () => group('test_3000_11_multi', exec_test);
export const test_3001_11 = () => group('test_3001_11', exec_test);
export const test_3001_11_multi = () => group('test_3001_11_multi', exec_test);
export const test_3002_11 = () => group('test_3002_11', exec_test);
export const test_3002_11_multi = () => group('test_3002_11_multi', exec_test);
export const test_3003_11 = () => group('test_3003_11', exec_test);
export const test_3003_11_multi = () => group('test_3003_11_multi', exec_test);

export const test_3000_12 = () => group('test_3000_12', exec_test);
export const test_3000_12_multi = () => group('test_3000_12_multi', exec_test);
export const test_3001_12 = () => group('test_3001_12', exec_test);
export const test_3001_12_multi = () => group('test_3001_12_multi', exec_test);
export const test_3002_12 = () => group('test_3002_12', exec_test);
export const test_3002_12_multi = () => group('test_3002_12_multi', exec_test);
export const test_3003_12 = () => group('test_3003_12', exec_test);
export const test_3003_12_multi = () => group('test_3003_12_multi', exec_test);

export const test_3000_13 = () => group('test_3000_13', exec_test);
export const test_3000_13_multi = () => group('test_3000_13_multi', exec_test);
export const test_3001_13 = () => group('test_3001_13', exec_test);
export const test_3001_13_multi = () => group('test_3001_13_multi', exec_test);
export const test_3002_13 = () => group('test_3002_13', exec_test);
export const test_3002_13_multi = () => group('test_3002_13_multi', exec_test);
export const test_3003_13 = () => group('test_3003_13', exec_test);
export const test_3003_13_multi = () => group('test_3003_13_multi', exec_test);

export const test_3000_14 = () => group('test_3000_14', exec_test);
export const test_3000_14_multi = () => group('test_3000_14_multi', exec_test);
export const test_3001_14 = () => group('test_3001_14', exec_test);
export const test_3001_14_multi = () => group('test_3001_14_multi', exec_test);
export const test_3002_14 = () => group('test_3002_14', exec_test);
export const test_3002_14_multi = () => group('test_3002_14_multi', exec_test);
export const test_3003_14 = () => group('test_3003_14', exec_test);
export const test_3003_14_multi = () => group('test_3003_14_multi', exec_test);
