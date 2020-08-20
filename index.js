/* eslint-disable no-restricted-syntax */

'use strict';

const fp = require('fastify-plugin');
const abslog = require('abslog');

module.exports = fp((fastify, opts, done) => {
    let { live, ready } = opts;
    const { livePathname = '/live', readyPathname = '/ready', logger } = opts;
    const log = abslog(logger);
    // LIVENESS
    // undefined/null             200
    // false                      500
    // true                       200
    // promise -> true            200
    // promise -> false           500

    // READINESS
    // undefined/null + no live   500
    // undefined/null + live      whatever live does
    // false                      500
    // true                       200
    // promise -> true            200
    // promise -> false           500

    if (!ready && ready !== false) {
        ready = false;

        if (live) {
            ready = live;
        }
    }

    if (!live && live !== false) {
        live = true;
    }

    // ensure error handler has been attached
    if (live.then) live.catch(() => {});
    if (ready.then) ready.catch(() => {});

    // live
    fastify.get(livePathname, async (request, reply) => {
        try {
            if (typeof live === 'function') live = live();
            const isLive = await live;
            if (!live.then && !isLive) throw new Error();
            reply.code(200).send('Server live');
            log.trace(
                'Liveness endpoint responded with 200 ok. Server is live.',
            );
        } catch (err) {
            reply.code(500).send('Server not live');
            log.fatal(
                'Liveness endpoint responded with a non 200 status code. Server is not live.',
            );
        }
    });

    // ready
    fastify.get(readyPathname, async (request, reply) => {
        try {
            if (typeof ready === 'function') ready = ready();
            const isReady = await ready;
            if (!ready.then && !isReady) throw new Error();
            reply.code(200).send('Server ready');
            log.trace(
                'Readiness endpoint responded with 200 ok. Server is ready.',
            );
        } catch (err) {
            reply.code(500).send('Server not ready');
            log.error(
                'Readiness endpoint responded with a non 200 status code. Server is not ready.',
            );
        }
    });

    done();
}, {
    fastify: '^3.0.0',
    name: 'fastify-ready-checks',
});
