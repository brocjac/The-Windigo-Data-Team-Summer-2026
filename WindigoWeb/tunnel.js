// 🚇 LocalTunnel for WindigoWeb
// Start the Vite dev server first, then run:
//   node tunnel.js [port]
//
// Access the app at the tunnel URL shown in the console.
// If you get a 503, add ?Bypass-Tunnel-Reminder=1 to the URL.

const localtunnel = require('localtunnel');

const port = parseInt(process.argv[2] || '5175', 10);

(async () => {
  const tunnel = await localtunnel({ port });
  console.log('==================================');
  console.log('Tunnel URL: ' + tunnel.url);
  console.log('Forwarding localhost:' + port + ' -> ' + tunnel.url);
  console.log('');
  console.log('IMPORTANT: If you get 503, add ?Bypass-Tunnel-Reminder=1');
  console.log('to the URL or use the header: Bypass-Tunnel-Reminder: 1');
  console.log('==================================');

  tunnel.on('close', () => {
    console.log('Tunnel closed');
  });
})();
