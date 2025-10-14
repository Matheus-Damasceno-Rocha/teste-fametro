-- PostgreSQL schema for the project (minimal to run Sequelize sync=false)

CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  tipo CHAR(1) NOT NULL DEFAULT 'A',
  status CHAR(1) NOT NULL DEFAULT 'A'
);

CREATE TABLE IF NOT EXISTS sala (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  capacidade INTEGER,
  tipo TEXT,
  localizacao TEXT,
  status CHAR(1) NOT NULL DEFAULT 'A'
);

CREATE TABLE IF NOT EXISTS equipamento (
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS disciplina (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sala_equipamento (
  sala_id INTEGER NOT NULL REFERENCES sala(id) ON DELETE CASCADE,
  equipamento_id INTEGER NOT NULL REFERENCES equipamento(id) ON DELETE CASCADE,
  PRIMARY KEY (sala_id, equipamento_id)
);

CREATE TABLE IF NOT EXISTS reserva (
  id SERIAL PRIMARY KEY,
  sala_id INTEGER REFERENCES sala(id) ON DELETE SET NULL,
  professor_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  disciplina_id INTEGER REFERENCES disciplina(id) ON DELETE SET NULL,
  data_hora TIMESTAMP NOT NULL,
  status CHAR(1) NOT NULL DEFAULT 'A'
);

CREATE TABLE IF NOT EXISTS participante (
  reserva_id INTEGER NOT NULL REFERENCES reserva(id) ON DELETE CASCADE,
  aluno_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  PRIMARY KEY (reserva_id, aluno_id)
);

CREATE TABLE IF NOT EXISTS notificacao (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
  reserva_id INTEGER REFERENCES reserva(id) ON DELETE SET NULL
);
