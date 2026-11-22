const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarios = require('../models/usuarios.model');
const { jwtSecret, jwtExpiresIn } = require('../config');
const { validarRegistro, validarLogin } = require('../utils/validaciones');

async function registro(req, res) {
  const error = validarRegistro(req.body);
  if (error) return res.status(400).json({ error });

  const passwordHash = await bcrypt.hash(req.body.password, 10);
  try {
    const usuario = await usuarios.crear({
      nombre: req.body.nombre.trim(),
      correo: req.body.correo.trim().toLowerCase(),
      passwordHash,
    });
    return res.status(201).json({ usuario });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El correo ya está registrado.' });
    }
    throw err;
  }
}

async function login(req, res) {
  const error = validarLogin(req.body);
  if (error) return res.status(400).json({ error });

  const usuario = await usuarios.buscarPorCorreo(req.body.correo.trim().toLowerCase());
  const coincide = usuario && (await bcrypt.compare(req.body.password, usuario.password_hash));
  if (!coincide || usuario.rol !== req.body.rol) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  }

  const token = jwt.sign(
    { sub: usuario.id, correo: usuario.correo, rol: usuario.rol },
    jwtSecret,
    { algorithm: 'HS256', expiresIn: jwtExpiresIn },
  );
  return res.status(200).json({ token, token_type: 'Bearer', expires_in: jwtExpiresIn });
}

module.exports = { registro, login };