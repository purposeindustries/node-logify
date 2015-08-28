const colors = process.stdout.isTTY;
import chalk from 'chalk';

const table = {
  trace: chalk.gray,
  debug: chalk.bold.gray,
  info: chalk.white,
  notice: chalk.bold.white,
  warn: chalk.yellow,
  error: chalk.red,
  critical: chalk.bgRed.bold.white,
};

function pad(str) {
  return ('        ' + str).slice(-8);
}

export default function format(entry) {
  const level = entry.level || 'info';
  const message = `[${entry.time.toISOString()}]${pad(level.toUpperCase())}: ${entry.component || 'default'}/${entry.pid} on ${entry.hostname}/${entry.arch}-${entry.platform}: ${entry.message}\n${entry.error ? entry.error.stack + '\n' : ''}`;
  if (colors) {
    return (table[level] || table.info)(message)
  }
  return message;
}
