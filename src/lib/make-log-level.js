export default function makeLogger(level) {
  return function log(context, message, ...args) {
    // no context given
    if (typeof context === 'string') {
      args = [].slice.call(arguments, 1);
      message = context;
      context = null;
    }

    // context is an error
    if (context instanceof Error) {
      context = {
        error: context,
      };
      if (message == undefined) {
        message = context.error.message;
      }
    }

    if (!context) {
      context = {};
    }

    if (message) {
      context.message = format(message, ...args);
    }
    context.level = level;
    context.time = context.time || new Date();

    return this.log(extend({}, this.context, context));
  };
}
