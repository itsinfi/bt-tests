Bun.serve({
    port: 5000,
    hostname: '0.0.0.0',
    routes: {
        '/*': {
            GET: new Response('Hello World!'),
        }
    }
});