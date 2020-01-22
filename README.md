# Fastify Ready Checks

Ready checks plugin for fastify Node.js web app framework

## Usage

### Basic usage

```js
const app = require('fastify')();
const plugin = require('fastify-ready-checks');
app.register(plugin);
```

An endpoint `/live` which will respond with `200 Server live` will be added to your app
An endpoint `/ready` which will respond with `500 Server not ready` will be added to your app

### Setting fixed boolean responses

```js
app.register(plugin, { live: true, ready: true });
```

An endpoint `/live` which will respond with `200 Server live` will be added to your app
An endpoint `/ready` which will respond with `200 Server ready` will be added to your app

### Passing functions

```js
app.register(plugin, { live: () => true, ready: () => true });
```

An endpoint `/live` will be added to your app which will first call the given live function and then respond with `200 Server live` since return value of the function is truthy
An endpoint `/ready` will be added to your app which will first call the given ready function and then respond with `200 Server ready` since return value of the function is truthy

### Passing functions that return promises

```js
app.register(plugin, {
    live: () => Promise.resolve(),
    ready: () => Promise.reject(),
});
```

An endpoint `/live` will be added to your app which will first call the given live function, then await the returned promise and then respond with `200 Server live` since the promise did not reject.
An endpoint `/ready` will be added to your app which will first call the given ready function, then await the returned promise and then respond with `500 Server not ready` since the promise rejected.

### Passing promises

```js
app.register(plugin, {
    live: Promise.resolve(),
    ready: Promise.reject(),
});
```

An endpoint `/live` will be added to your app which will await the given promise and then respond with `200 Server live` since the promise did not reject.
An endpoint `/ready` will be added to your app which will await the given promise and then respond with `500 Server not ready` since the promise rejected.

### Setting pathnames

```js
app.register(plugin, {
    livePathname: '/_/health',
    readyPathname: '/_/ready',
    ready: true,
});
```

An endpoint `/_/health` will be added to your app which will respond with `200 Server live`
An endpoint `/_/ready` will be added to your app which will respond with `500 Server ready`

## Plugin options

```js
app.register(plugin, {
    logger,
    livePathname,
    readyPathname,
    live,
    ready,
});
```

| name          | description                                                                                      | type                                                                         | default  |
| ------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | -------- |
| logger        | log4j compatible logger (usually [pino](https://www.npmjs.com/package/pino)) to use for logging. | `object`                                                                     |          |
| live          | Either boolean value, function or promise used to determine if app is live                       | `boolean` or `function` => `boolean` or `promise` or `function` => `promise` | `true`   |
| ready         | Either boolean value, function or promise used to determine if app is ready                      | `boolean` or `function` => `boolean` or `promise` or `function` => `promise` | `false`  |
| livePathname  | Pathname for endpoint where live checks will be served                                           | `string`                                                                     | `/live`  |
| readyPathname | Pathname for endpoint where ready checks will be served                                          | `string`                                                                     | `/ready` |
