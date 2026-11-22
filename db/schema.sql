CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rol VARCHAR(10) NOT NULL DEFAULT 'usuario' CHECK (rol IN ('usuario', 'admin')),
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  precio NUMERIC(10, 2) NOT NULL CHECK (precio > 0)
);

CREATE TABLE IF NOT EXISTS favoritos (
  usuario_id INT NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
  producto_id INT NOT NULL REFERENCES productos (id) ON DELETE CASCADE,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (usuario_id, producto_id)
);