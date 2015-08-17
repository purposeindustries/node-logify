import filter from './filter';

export default function create(n, ...appenders) {
  let enabled = true;
  return filter(function () {
    if (!enabled) {
      return false;
    }
    setTimeout(() => enabled = true, n * 1000);
    enabled = false;
    return true;
  }, ...appenders);
}
