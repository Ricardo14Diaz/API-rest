const pool = require('../db');

async function crear({ nombre, correo, passwordHash }) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, correo, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, nombre, correo, rol`,
    [nombre, correo, passwordHash],
  );
  return rows[0];
}

async function buscarPorCorreo(correo) {
  const { rows } = await pool.query(
    'SELECT id, nombre, correo, rol, password_hash FROM usuarios WHERE correo = $1',
    [correo],
  );
  return rows[0] || null;
}

module.exports = { crear, buscarPorCorreo };