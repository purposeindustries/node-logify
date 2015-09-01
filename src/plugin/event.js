import extend from '../lib/extend';

export default function init(logger) {
  logger.event = function event(category, action, label, value, opts = {}) {
    const entry = {
      category,
      action,
      label,
      value,
      time: opts.time || new Date(),
    };
    this.log(extend({}, this.context, opts, entry));
  };
  return logger;
}
