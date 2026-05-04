const net = require('net');

const regions = ['oregon', 'frankfurt', 'singapore', 'ohio', 'virginia'];
const baseHost = 'dpg-d7dlnjflk1mc73er6tag-a';

async function checkHost(host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(5432, host);
  });
}

async function main() {
  for (const region of regions) {
    const host = `${baseHost}.${region}-postgres.render.com`;
    console.log(`Checking ${host}...`);
    const isUp = await checkHost(host);
    if (isUp) {
      console.log(`SUCCESS: Found the external database host: ${host}`);
      return;
    }
  }
  console.log('FAILED: Could not find the external database host.');
}

main();
