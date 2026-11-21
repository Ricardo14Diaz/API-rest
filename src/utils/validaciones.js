const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CAMPOS_REGISTRO = new Set(['nombre', 'correo', 'password']);
const CAMPOS_PRODUCTO = new Set(['nombre', 'descripcion', 'categoria', 'precio']);

const esTextoNoVacio = (v) => typeof v === 'string' && v.trim().length > 0;
const esObjeto = (b) => b !== null && typeof b === 'object' && !Array.isArray(b);

// Identificador entero positivo que cabe en un INT de PostgreSQL.
function esIdValido(valor) {
  return /^[1-9]\d{0,9}$/.test(String(valor)) && Number(valor) <= 2147483647;
}

function validarRegistro(body) {
  if (!esObjeto(body)) return 'El cuerpo debe ser un objeto JSON.';
  if (Object.keys(body).some((c) => !CAMPOS_REGISTRO.has(c))) {
    return 'El cuerpo contiene campos no permitidos.';
  }
  if (!esTextoNoVacio(body.nombre)) return 'nombre es obligatorio.';
  if (!esTextoNoVacio(body.correo) || !EMAIL_RE.test(body.correo.trim())) {
    return 'correo es obligatorio y debe tener un formato válido.';
  }
  if (typeof body.password !== 'string' || body.password.length < 8) {
    return 'password es obligatorio y debe tener al menos 8 caracteres.';
  }
  return null;
}

function validarLogin(body) {
  if (!esObjeto(body) || typeof body.correo !== 'string' || typeof body.password !== 'string') {
    return 'correo y password son obligatorios.';
  }
  return null;
}

function validarProducto(body, { creando = false } = {}) {
  if (!esObjeto(body)) return 'El cuerpo debe ser un objeto JSON.';
  if (Object.keys(body).some((c) => !CAMPOS_PRODUCTO.has(c))) {
    return 'El cuerpo contiene campos no permitidos.';
  }
  if (!creando && Object.keys(body).length === 0) return 'Envía al menos un campo para actualizar.';

  for (const campo of ['nombre', 'descripcion', 'categoria']) {
    if (body[campo] === undefined) {
      if (creando) return `${campo} es obligatorio.`;
    } else if (!esTextoNoVacio(body[campo])) {
      return `${campo} debe ser un texto no vacío.`;
    }
  }

  if (body.precio === undefined) {
    if (creando) return 'precio es obligatorio.';
  } else if (typeof body.precio !== 'number' || !Number.isFinite(body.precio) || body.precio <= 0) {
    return 'precio debe ser un número mayor que 0.';
  }
  return null;
}

module.exports = { esIdValido, validarRegistro, validarLogin, validarProducto };