'use strict';

const { test } = require('tap');
const fastify = require('fastify');
const supertest = require('supertest');
const plugin = require('./index');

test('Plugin renders basic metrics page', async t => {
    const app = fastify();
    app.register(plugin, {});
    const address = await app.listen();
    const http = supertest(address);
    await app.close();
});
