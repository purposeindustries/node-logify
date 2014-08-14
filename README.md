# logify

Logging library for node.

## Install

Install the [package](http://npmjs.org/package/logify) with [npm](http://npmjs.org):

```sh
$ npm install logify
```

## Usage

```js
var logify = require('logify');
var logger = logify();

logger.debug('This is a debug message!');
logger.info('You %s interpolate variables, using util.format!', 'can');
logger.notice(err);
logger.warning(err, 'Custom error messages, with interpolation: %s', err.message);
logger.error({
  foo: 'bar'
}, 'Additional fields to log');
// other log levels are `crit`, `alert`, and `emerg`
```

### Log levels

Default log levels are syslog levels, defined in [logify-syslog-levels](https://github.com/purposeindustries/node-logify-syslog-levels), but you can use your own log levels:

```js
var logger = logify({
  levels: myLogLevels
});
```

`levels` should be an array of objects (`level`s).
Each `level` should have a `name` (that is used to create a shorthand method on logger),
a `code` (for determining log level, lower leves have higher priority),
and an optional `color` function, which is used to decorate output.

### Transports

Default transport is [logify-console-transport](https://github.com/purposeindustries/logify-console-transport), but you can write your own!

```js
var logger = logify({
  transports: [myTransport]
});

// or

logger.add(mytransport);
```

### Child loggers

Use `logger.child(additionalContext)` to create a child logger, with more context.

### Serializers

Serializers are used to transform context to a JSONifyable object.
Each key in the context can has a serializer.

## License

MIT
