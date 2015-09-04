export default function compose(f, g, h) {
  if (!h) {
    return function (x) {
      return f(g(x));
    };
  }
  return function (x) {
    return f(g(h(x)));
  };
}
