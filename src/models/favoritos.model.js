const pool = require('../db');

async function listar(usuarioId) {
  const { rows } = await pool.query(
    `SELECT p.id, p.nombre, p.descripcion, p.categoria, p.precio::float8 AS precio, f.creado_en
     FROM favoritos f
     JOIN productos p ON p.id = f.producto_id
     WHERE f.usuario_id = $1
     ORDER BY f.creado_en, p.id`,
    [usuarioId],
  );
  return rows;
}

// Devuelve false si el favorito ya existía (la clave primaria compuesta evita duplicados).
async function agregar(usuarioId, productoId) {
  const { rowCount } = await pool.query(
    `INSERT INTO favoritos (usuario_id, producto_id)
     VALUES ($1, $2)
     ON CONFLICT (usuario_id, producto_id) DO NOTHING`,
    [usuarioId, productoId],
  );
  return rowCount > 0;
}

// Filtra siempre por usuario_id: nadie puede quitar favoritos ajenos.
async function quitar(usuarioId, productoId) {
  const { rowCount } = await pool.query(
    'DELETE FROM favoritos WHERE usuario_id = $1 AND producto_id = $2',
    [usuarioId, productoId],
  );
  return rowCount > 0;
}

module.exports = { listar, agregar, quitar }; 