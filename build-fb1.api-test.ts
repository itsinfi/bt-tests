await Bun.build({
    entrypoints: ['./src/fb1.api-test.ts'],
    outdir: './dist',
    target: 'browser',
    env: 'inline',
});