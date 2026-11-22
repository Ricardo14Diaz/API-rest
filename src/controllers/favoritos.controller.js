const favoritos = require('../models/favoritos.model');
const productos = require('../models/productos.model');
const { esIdValido } = require('../utils/validaciones');

async function listar(req, res) {
  const lista = await favoritos.listar(req.user.id);
  return res.status(200).json({ favoritos: lista });
}

async function agregar(req, res) {
  const productoId = req.body?.productoId;
  if (typeof productoId !== 'number' || !esIdValido(productoId)) {
    return res.status(400).json({ error: 'productoId es obligatorio y debe ser un entero positivo.' });
  }
  if (!(await productos.obtener(productoId))) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }
  const creado = await favoritos.agregar(req.user.id, productoId);
  if (!creado) return res.status(409).json({ error: 'El producto ya está en tus favoritos.' });
  return res.status(201).json({ favorito: { productoId } });
}

async function quitar(req, res) {
  if (!esIdValido(req.params.productoId)) {
    return res.status(400).json({ error: 'El id no es válido.' });
  }
  const quitado = await favoritos.quitar(req.user.id, Number(req.params.productoId));
  if (!quitado) return res.status(404).json({ error: 'Favorito no encontrado.' });
  return res.status(204).end();
}

module.exports = { listar, agregar, quitar };