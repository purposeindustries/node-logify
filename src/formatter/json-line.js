import json from './json';

export default function jsonLine(entry) {
  return json(entry) + '\n';
}
