function detect() {
  const visited = [];
  return function (key, value) {
    if (visited.indexOf(this[key]) !== -1) {
      return '[Circular]';
    }
    if (visited.indexOf(this) === -1) {
      visited.push(this);
    }
    return value;
  };
}

export default function (entry) {
  return JSON.stringify(entry, detect());
}
