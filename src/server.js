const app = require('./app');
const pool = require('./db');
const { port } = require('./config');

const server = app.listen(port, () => {
  console.log(`API disponible en http://localhost:${port}`);
});

function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);