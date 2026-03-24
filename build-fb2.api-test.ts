require('esbuild').build({
    entryPoints: ['./src/fb2.api-test.ts'],
    bundle: true,
    outfile: 'dist/test.js',
    platform: 'browser',
    target: 'es2015',
}).catch(() => process.exit(1));