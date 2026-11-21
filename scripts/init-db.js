const fs = require('node:fs');
const path = require('node:path');
const pool = require('../src/db');

async function inicializar() {
  const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
  await pool.query(schema);

  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM productos');
  if (rows[0].total === 0) {
    const seed = fs.readFileSync(path.join(__dirname, '../db/seed.sql'), 'utf8');
    await pool.query(seed);
    console.log('Productos de ejemplo cargados.');
  } else {
    console.log('Ya existen productos; no se cargaron datos de ejemplo.');
  }
  console.log('Base de datos lista.');
}

inicializar()
  .catch((error) => {
    console.error('Error inicializando la base de datos:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());