import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import puppeteer, { Browser } from 'puppeteer';
import type { ErrorResponse, LighthouseMetrics, LoginResponse } from './shared/types';
import { calculateStats } from './shared/calculate-stats';
import axios from 'axios';

// KONFIGURATION --------------------------------------------------------
if (!Bun.env.API_AUTH || !Bun.env.UI_URL || !Bun.env.UI_ROUTE || !Bun.env.TEST_LIGHTHOUSE_RUNS) {
    console.error('falsche eingabe, kopiere .env.example als .env und gib alle werte an');
    process.exit(1);
}

const API_AUTH = Bun.env.API_AUTH!;
const UI_URL = Bun.env.UI_URL!;
const ROUTE = `${UI_URL}${Bun.env.UI_ROUTE!}`;
const RUNS = parseInt(Bun.env.TEST_LIGHTHOUSE_RUNS!, 10);

const LOGIN_DATA = Object.freeze({
    email: Bun.env.API_LOGIN_EMAIL!,
    password: Bun.env.API_LOGIN_PASSWORD!,
});

const LOGIN_ROUTE = `${Bun.env.API_URL!}/auth/login`;

// RESULTATE AUSLESEN --------------------------------------------------------
function getMetrics(lhr: any): LighthouseMetrics {
    const audits = lhr.audits;
    
    return {
        fcp: audits['first-contentful-paint']?.numericValue,
        si: audits['speed-index']?.numericValue,
        lcp: audits['largest-contentful-paint']?.numericValue,
        tbt: audits['total-blocking-time']?.numericValue,
    };
}

// NAVIGATIONSTEST --------------------------------------------------------
async function runNavigation(port: number, url: string) {
    const result = await lighthouse(url, {
        port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance'],
        disableStorageReset: true,
    });
    
    return getMetrics(result!.lhr);
}

// HEAPGRÖSSEN-MESSUNG --------------------------------------------------------
async function measureHeap(browser: Browser, url: string) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const metrics = await page.metrics();
    await page.close();
    
    return metrics.JSHeapUsedSize;
}

// BROWSER-CACHE LEEREN (deutliche unterschiede in erstem zu weiteren messwerten ansonsten) --------------------------------------------------------
async function clearBrowserCache(browser: Browser) {
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();

    await client.send('Network.enable');
    await client.send('Network.clearBrowserCache');

    await page.close();
}

// TEST VORBEREITEN --------------------------------------------------------
let loginResponse: LoginResponse;

try {
    const response = await axios.post(LOGIN_ROUTE, LOGIN_DATA);
    loginResponse = response.data as unknown as LoginResponse;
} catch (error) {
    // console.log('error', error);
    throw new Error('login failed');
}

const chrome = await launch({
    chromeFlags: [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-storage-reset=false'
    ],
});

const browser = await puppeteer.connect({
    browserURL: `http://localhost:${chrome.port}`,
});

const page = await browser.newPage();

await page.setExtraHTTPHeaders({
    "Authorization": `Bearer ${API_AUTH}`,
});

await page.goto(new URL(UI_URL).origin, { waitUntil: 'domcontentloaded' });

await page.evaluate((userInfo: string) => {
    localStorage.setItem('lang', 'gr');
    localStorage.setItem('showProfileModal', 'false');
    localStorage.setItem('tutorial', 'false');
    localStorage.setItem('userInfo', userInfo);
}, JSON.stringify(loginResponse));


// TEST DURCHFÜHREN --------------------------------------------------------
const navigationRuns: any[] = [];

console.log(`Running ${RUNS} iterations for ${ROUTE}...\n`);

for (let i = 0; i < RUNS; i++) {
    console.log(`Run ${i + 1}/${RUNS}`);

    await clearBrowserCache(browser);
    
    const navMetrics = await runNavigation(chrome.port, ROUTE);
    const heap = await measureHeap(browser, ROUTE);
    
    navigationRuns.push({ ...navMetrics, heap });
}

await browser.disconnect();
try {
    chrome.kill();
} catch (error) {
    console.error('error during chrome kill', error);
}

// RESULTATE AGGREGIEREN --------------------------------------------------------
function aggregate(runs: any[]) {
    const keys = Object.keys(runs[0]);
    
    const result: any = {};
    for (const key of keys) {
        const values = runs.map(r => r[key]).filter(v => typeof v === 'number');
        result[key] = calculateStats(values);
    }
    return result;
}

// RESULTATE SPEICHERN --------------------------------------------------------
const output = {
    url: UI_URL,
    runs: RUNS,
    navigation: {
        raw: navigationRuns,
        stats: aggregate(navigationRuns),
    },
};

const now = (new Date().toISOString().split('.')[0] ?? '')
    .toString().replace(/:/g, '-');

const filename = `results/lighthouse-${now}.json`;
const data = JSON.stringify(output, null, 4);

await Bun.write(filename, data);