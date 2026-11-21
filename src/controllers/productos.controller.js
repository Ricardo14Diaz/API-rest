const productos = require('../models/productos.model');
const { esIdValido, validarProducto } = require('../utils/validaciones');

async function listar(req, res) {
  const { categoria } = req.query;
  if (categoria !== undefined && (typeof categoria !== 'string' || !categoria.trim())) {
    return res.status(400).json({ error: 'categoria debe ser un texto no vacío.' });
  }
  const lista = await productos.listar(categoria?.trim());
  return res.status(200).json({ productos: lista });
}

async function obtener(req, res) {
  if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'El id no es válido.' });
  const producto = await productos.obtener(Number(req.params.id));
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });
  return res.status(200).json({ producto });
}

async function crear(req, res) {
  const error = validarProducto(req.body, { creando: true });
  if (error) return res.status(400).json({ error });

  const producto = await productos.crear({
    nombre: req.body.nombre.trim(),
    descripcion: req.body.descripcion.trim(),
    categoria: req.body.categoria.trim(),
    precio: req.body.precio,
  });
  return res.status(201).json({ producto });
}

async function actualizar(req, res) {
  if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'El id no es válido.' });
  const error = validarProducto(req.body);
  if (error) return res.status(400).json({ error });

  const { nombre, descripcion, categoria, precio } = req.body;
  const producto = await productos.actualizar(Number(req.params.id), {
    nombre: nombre?.trim(),
    descripcion: descripcion?.trim(),
    categoria: categoria?.trim(),
    precio,
  });
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });
  return res.status(200).json({ producto });
}

async function eliminar(req, res) {
  if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'El id no es válido.' });
  const eliminado = await productos.eliminar(Number(req.params.id));
  if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado.' });
  return res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };