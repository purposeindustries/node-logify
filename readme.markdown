# logify

> "Batteries included, but removable" logging solution for node/io.js

### Project is under **HEAVY** development, expect things to break, etc

## Install

Install the [package](https://npmjs.com/package/logify) with [`npm`](https://npmjs.com):

```sh
$ npm install logify
```

## Usage

```js
import Logger from 'logify';

const logger = new Logger();

// ...

logger.debug('Hello world!');
logger.info('I can has %s interpolation', 'string');
logger.notice(context, 'I can attach objects to the log %s', 'message');
logger.warn(err);
logger.error(err, 'Custom error messages too \o/');
```

## API

### `logger.transform(fn)`

Transform the log entry with `fn(entry)` before processing.

### `logger.transform(field, fn[, always])`

Transform field `field` with `fn(entry[field])` before processing.
If always is `true`, the field is processed even if it is `undefined`.

### `logger.child(context)`

Create child logger with extended context.

### `logger.component(name)`

Create child logger for component

```js
const logger = new Logger();

const authLogger = logger.component('auth');
// { component: 'auth' }

const facebookAuthLogger = authLogger.component('facebook');
// { component: 'auth.facebook' }
```

### `logger.add(transport)`

Forward log entries to `transport`.

## Transports

### `stream(s, [formatter])`

Write log events to `s` with the given `formatter`.
The default formatter is `jsonLine`.

### `udp(socket, port, address, [formatter])`

Write log event to `socket`, send to `address:port` with the given `formatter`.
The default formatter is `jsonLine`

### `console([formatter])`

Write log events to `process.stdout` or `process.stderr` with the given `formatter`
(defaults to `console` formatter). Output stream is based on the severity.

## Filters

### `filter(fn, ...appenders)`

Forward log messages to `appenders`, based on the truthiness of `fn(message)`.

### `when(field, parrent, ...appenders)`

Forward log messages to `appenders`, based on pattern matching on the `field` field.

## Formatters

### `json`

Stringified JSON output.

### `jsonLine`

Newline-delimited stringified JSON output.

### `console`

Pretty, human-readable format, with colors if possible.
