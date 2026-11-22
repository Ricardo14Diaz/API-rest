const pool = require('../db');

const COLUMNAS = 'id, nombre, descripcion, categoria, precio::float8 AS precio';

async function listar(categoria) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS} FROM productos
     WHERE ($1::text IS NULL OR LOWER(categoria) = LOWER($1))
     ORDER BY id`,
    [categoria ?? null],
  );
  return rows;
}

async function obtener(id) {
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM productos WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function crear({ nombre, descripcion, categoria, precio }) {
  const { rows } = await pool.query(
    `INSERT INTO productos (nombre, descripcion, categoria, precio)
     VALUES ($1, $2, $3, $4)
     RETURNING ${COLUMNAS}`,
    [nombre, descripcion, categoria, precio],
  );
  return rows[0];
}

async function actualizar(id, { nombre, descripcion, categoria, precio }) {
  const { rows } = await pool.query(
    `UPDATE productos
     SET nombre = COALESCE($1, nombre),
         descripcion = COALESCE($2, descripcion),
         categoria = COALESCE($3, categoria),
         precio = COALESCE($4, precio)
     WHERE id = $5
     RETURNING ${COLUMNAS}`,
    [nombre ?? null, descripcion ?? null, categoria ?? null, precio ?? null, id],
  );
  return rows[0] || null;
}

async function eliminar(id) {
  const { rowCount } = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { listar, obtener, crear, actualizar, eliminar };