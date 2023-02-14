import { test } from 'tap';
import fastify from 'fastify';
import supertest from 'supertest';
import plugin from './index.js';

test('Plugin default behaviour', async t => {
    const app = fastify();
    app.register(plugin);
    const address = await app.listen();
    const http = supertest(address);

    const health = await http.get('/live');
    t.equal(health.status, 200);
    t.equal(health.text, 'Server live');

    const ready = await http.get('/ready');
    t.equal(ready.status, 500);
    t.equal(ready.text, 'Server not ready');

    await app.close();
});

test('Plugin setting ready true', async t => {
    const app = fastify();
    app.register(plugin, { ready: true });
    const address = await app.listen();
    const http = supertest(address);

    const health = await http.get('/live');
    t.equal(health.status, 200);
    t.equal(health.text, 'Server live');

    const ready = await http.get('/ready');
    t.equal(ready.status, 200);
    t.equal(ready.text, 'Server ready');

    await app.close();
});

test('Plugin setting live and ready true', async t => {
    const app = fastify();
    app.register(plugin, { live: true, ready: true });
    const address = await app.listen();
    const http = supertest(address);

    const health = await http.get('/live');
    t.equal(health.status, 200);
    t.equal(health.text, 'Server live');

    const ready = await http.get('/ready');
    t.equal(ready.status, 200);
    t.equal(ready.text, 'Server ready');

    await app.close();
});

test('Plugin setting live and ready false', async t => {
    const app = fastify();
    app.register(plugin, { live: false, ready: false });
    const address = await app.listen();
    const http = supertest(address);

    const health = await http.get('/live');
    t.equal(health.status, 500);
    t.equal(health.text, 'Server not live');

    const ready = await http.get('/ready');
    t.equal(ready.status, 500);
    t.equal(ready.text, 'Server not ready');

    await app.close();
});

test('Plugin setting live and ready functions that return true', async t => {
    const app = fastify();
    app.register(plugin, { live: () => true, ready: () => true });
    const address = await app.listen();
    const http = supertest(address);

    const health = await http.get('/live');
    t.equal(health.status, 200);
    t.equal(health.text, 'Server live');

    const ready = await http.get('/ready');
    t.equal(ready.status, 200);
    t.equal(ready.text, 'Server ready');

    await app.close();
});

test('Plugin setting live and ready functions that return false', async t => {
    const app = fastify();
    app.register(plugin, { live: () => false, ready: () => false });
    const address = await app.listen();
    const http = supertest(address);

    const health = await http.get('/live');
    t.equal(health.status, 500);
    t.equal(health.text, 'Server not live');

    const ready = await http.get('/ready');
    t.equal(ready.status, 500);
    t.equal(ready.text, 'Server not ready');

    await app.close();
});

test('Plugin setting live and ready functions that return promises that resolve', async t => {
    const app = fastify();
    app.register(plugin, {
        live: () => Promise.resolve(),
        ready: () => Promise.resolve(),
    });
    const address = await app.listen();
    const http = supertest(address);

    const health = await http.get('/live');
    t.equal(health.status, 200);
    t.equal(health.text, 'Server live');

    const ready = await http.get('/ready');
    t.equal(ready.status, 200);
    t.equal(ready.text, 'Server ready');

    await app.close();
});

test('Plugin setting live and ready functions that return promises that reject', async t => {
    const app = fastify();
    app.register(plugin, {
        live: () => Promise.reject(),
        ready: () => Promise.reject(),
    });
    const address = await app.listen();
    const http = supertest(address);

    const health = await http.get('/live');
    t.equal(health.status, 500);
    t.equal(health.text, 'Server not live');

    const ready = await http.get('/ready');
    t.equal(ready.status, 500);
    t.equal(ready.text, 'Server not ready');

    await app.close();
});

test('Plugin setting live and ready promises that resolve', async t => {
    const app = fastify();
    app.register(plugin, {
        live: Promise.resolve(),
        ready: Promise.resolve(),
    });
    const address = await app.listen();
    const http = supertest(address);

    const health = await http.get('/live');
    t.equal(health.status, 200);
    t.equal(health.text, 'Server live');

    const ready = await http.get('/ready');
    t.equal(ready.status, 200);
    t.equal(ready.text, 'Server ready');

    await app.close();
});

test('Plugin setting live and ready promises that reject', async t => {
    const app = fastify();
    const failingPromise = Promise.reject();
    app.register(plugin, {
        live: failingPromise,
        ready: failingPromise,
    });
    const address = await app.listen();
    const http = supertest(address);

    const health = await http.get('/live');
    t.equal(health.status, 500);
    t.equal(health.text, 'Server not live');

    const ready = await http.get('/ready');
    t.equal(ready.status, 500);
    t.equal(ready.text, 'Server not ready');

    await app.close();
});

test('Plugin setting endpoint pathnames', async t => {
    const app = fastify();
    app.register(plugin, {
        ready: true,
        livePathname: '/_/health',
        readyPathname: '/_/ready',
    });
    const address = await app.listen();
    const http = supertest(address);

    const health = await http.get('/_/health');
    t.equal(health.status, 200);
    t.equal(health.text, 'Server live');

    const ready = await http.get('/_/ready');
    t.equal(ready.status, 200);
    t.equal(ready.text, 'Server ready');

    await app.close();
});
