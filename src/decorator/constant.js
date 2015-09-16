export default function create(key, value) {
  return function init(logger) {
    logger.context[key] = value;
    return logger;
  };
}
