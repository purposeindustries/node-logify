export default function extend(target, ...srcs) {
  for (const src of srcs) {
    for (const key in src) {
      target[key] = src[key];
    }
  }
  return target;
}
