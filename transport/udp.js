export function create(socket, port, address, layout) {
  return function log(entry) {
    const message = layout(entry);
    return socket.send(message, 0, message.length, port, address);
  };
}
