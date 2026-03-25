#!/usr/bin/env bun

import { writeFileSync } from "fs";

// CONFIG --------------------------------------------------------
if (!Bun.env.API_CONTAINER_NAME || !Bun.env.TEST_RAM_INT_MS) {
    console.error('falsche eingabe, kopiere .env.example als .env und gib alle werte an');
    process.exit(1);
}

const INVERVAL_MS: number = parseInt(Bun.env.TEST_RAM_INT_MS, 10);
const CONTAINER_NAME: string = Bun.env.API_CONTAINER_NAME;

let running = true;

// METRICS --------------------------------------------------------
/**
 * Erster RAM-Verbrauch (RSS on startup)
 */
let firstValue: number | null = null;

/**
 * Peak-RAM-Verbrauch (Peak RSS)
 */
let peakValue: number = 0;

// MONITORING --------------------------------------------------------

/**
 * verwendet `docker stats`, um RAM-Verbrauch in Bytes auszulesen
 */
async function getMemoryUsage(): Promise<number | null> {
    try {
        const proc = Bun.spawn({
            cmd: [
                "docker",
                "stats",
                "--no-stream",
                "--format",
                "{{.MemUsage}}",
                CONTAINER_NAME!
            ],
            stdout: 'pipe',
        });

        let output = '';

        const decoder = new TextDecoder();

        for await (const chunk of proc.stdout) {
            output += decoder.decode(chunk);
        }

        const match = output.match(/^([\d.]+)([KMG]iB)\s*\//);

        if (!match) {
            console.error(`unexpected output format for value ${output}`);
            return null;
        }

        const value = parseFloat(match[1] ?? '');
        const unit = match[2];

        const factor =
            unit === "KiB" ? 1024 :
            unit === "MiB" ? 1024 ** 2 :
                    unit === "GiB" ? 1024 ** 3 : 1;

        return value * factor; // in bytes
    } catch (error) {
        console.error('error:', error);
        return null;
    }
}

/**
 * ruft jeden Zeitintervall `getMemoryUsage` auf, und verfolgt ersten und höchsten RAM-Verbauch
 */
async function monitor() {
    while (running) {
        const mem = await getMemoryUsage();

        if (mem !== null) {
            if (firstValue === null) {
                firstValue = mem;
            }

            if (mem > peakValue) {
                peakValue = mem;
            }

            console.log(`RAM: ${(mem / 1024 / 1024).toFixed(2)} MiB`);
        } else {
            console.warn("could not read memory usage");
        }

        await new Promise(r => setTimeout(r, INVERVAL_MS));
    }
}

// BERICHT --------------------------------------------------------
function saveResults() {
    const result = {
        container: CONTAINER_NAME,
        first_bytes: firstValue,
        peak_bytes: peakValue,
        first_mib: firstValue ? firstValue / 1024 / 1024 : null,
        peak_mib: peakValue / 1024 / 1024,
    };

    const now = (new Date().toISOString().split('.')[0] ?? '')
        .toString().replace(/:/g, '-');

    const fileName = `results/ram-${CONTAINER_NAME}-${now}.json`;
    const data = JSON.stringify(result, null, 2);
    
    writeFileSync(fileName, data);
    console.log(`\nsaved results to ${fileName}`);
}

process.on('SIGINT', () => {
    console.log('\nStopping...');
    running = false;
    saveResults();
    process.exit(0);
});

process.on('SIGTERM', () => {
    running = false;
    saveResults();
    process.exit(0);
});

monitor();