import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import puppeteer, { Browser } from 'puppeteer';
import type { LighthouseMetrics } from './shared/types';
import { calculateStats } from './shared/calculate-stats';

// KONFIGURATION --------------------------------------------------------
if (!Bun.env.UI_URL || !Bun.env.TEST_LIGHTHOUSE_RUNS) {
    console.error('falsche eingabe, kopiere .env.example als .env und gib alle werte an');
    process.exit(1);
}

const URL = Bun.env.UI_URL!;
const RUNS = parseInt(Bun.env.TEST_LIGHTHOUSE_RUNS!, 10);

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

// TEST STARTEN --------------------------------------------------------
const chrome = await launch({ chromeFlags: ['--headless'] });

const browser = await puppeteer.connect({
    browserURL: `http://localhost:${chrome.port}`,
});

const navigationRuns: any[] = [];

console.log(`Running ${RUNS} iterations for ${URL}...\n`);

for (let i = 0; i < RUNS; i++) {
    console.log(`Run ${i + 1}/${RUNS}`);
    
    const navMetrics = await runNavigation(chrome.port, URL);
    const heap = await measureHeap(browser, URL);
    
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
    url: URL,
    runs: RUNS,
    navigation: {
        raw: navigationRuns,
        stats: aggregate(navigationRuns),
    },
};

await Bun.write('results/lighthouse-results.json', JSON.stringify(output, null, 2));