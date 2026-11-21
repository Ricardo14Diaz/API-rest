require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/db');

async function crearAdmin() {
  const { ADMIN_NOMBRE, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
    throw new Error('Define ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 8 caracteres) en .env.');
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const { rowCount } = await pool.query(
    `INSERT INTO usuarios (nombre, correo, password_hash, rol)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (correo) DO NOTHING`,
    [ADMIN_NOMBRE || 'Administrador', ADMIN_EMAIL.trim().toLowerCase(), hash],
  );
  console.log(rowCount ? 'Administrador creado.' : 'El administrador ya existe; no se modificó.');
}

crearAdmin()
  .catch((error) => {
    console.error('Error:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());