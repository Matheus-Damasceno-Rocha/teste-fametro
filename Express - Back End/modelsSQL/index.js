const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

// Usuario
const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
  tipo: { type: DataTypes.STRING(1), allowNull: false, defaultValue: 'A' },
  status: { type: DataTypes.STRING(1), allowNull: false, defaultValue: 'A' },
}, { tableName: 'usuario', underscored: true, timestamps: false });

// Sala
const Sala = sequelize.define('Sala', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  capacidade: { type: DataTypes.INTEGER, allowNull: true },
  tipo: { type: DataTypes.STRING, allowNull: true },
  localizacao: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.STRING(1), allowNull: false, defaultValue: 'A' },
}, { tableName: 'sala', underscored: true, timestamps: false });

// Equipamento
const Equipamento = sequelize.define('Equipamento', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descricao: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'equipamento', underscored: true, timestamps: false });

// Disciplina
const Disciplina = sequelize.define('Disciplina', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'disciplina', underscored: true, timestamps: false });

// SalaEquipamento (many-to-many)
const SalaEquipamento = sequelize.define('SalaEquipamento', {
  sala_id: { type: DataTypes.INTEGER, allowNull: false },
  equipamento_id: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'sala_equipamento', underscored: true, timestamps: false });

// Reserva
const Reserva = sequelize.define('Reserva', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sala_id: { type: DataTypes.INTEGER, allowNull: true },
  professor_id: { type: DataTypes.INTEGER, allowNull: false },
  disciplina_id: { type: DataTypes.INTEGER, allowNull: true },
  data_hora: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING(1), allowNull: false, defaultValue: 'A' },
}, { tableName: 'reserva', underscored: true, timestamps: false });

// Participante (aluno) - join of alunos to reservas
const Participante = sequelize.define('Participante', {
  reserva_id: { type: DataTypes.INTEGER, allowNull: false },
  aluno_id: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'participante', underscored: true, timestamps: false });

// Notificacao
const Notificacao = sequelize.define('Notificacao', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  mensagem: { type: DataTypes.TEXT, allowNull: false },
  data_hora: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  reserva_id: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'notificacao', underscored: true, timestamps: false });

// Associations
// Usuario (professor) 1:n Reserva
Usuario.hasMany(Reserva, { as: 'reservas', foreignKey: 'professor_id' });
Reserva.belongsTo(Usuario, { as: 'professor', foreignKey: 'professor_id' });

// Sala 1:n Reserva
Sala.hasMany(Reserva, { as: 'reservas', foreignKey: 'sala_id' });
Reserva.belongsTo(Sala, { as: 'sala', foreignKey: 'sala_id' });

// Disciplina 1:n Reserva
Disciplina.hasMany(Reserva, { as: 'reservas', foreignKey: 'disciplina_id' });
Reserva.belongsTo(Disciplina, { as: 'disciplina', foreignKey: 'disciplina_id' });

// Many-to-many Sala <-> Equipamento
Sala.belongsToMany(Equipamento, { through: SalaEquipamento, foreignKey: 'sala_id', otherKey: 'equipamento_id', as: 'equipamentos' });
Equipamento.belongsToMany(Sala, { through: SalaEquipamento, foreignKey: 'equipamento_id', otherKey: 'sala_id', as: 'salas' });

// Participantes: Reserva 1:n Participantes
Reserva.hasMany(Participante, { as: 'participantes', foreignKey: 'reserva_id' });
Participante.belongsTo(Reserva, { as: 'reserva', foreignKey: 'reserva_id' });

// Notificacao: Usuario 1:n
Usuario.hasMany(Notificacao, { as: 'notificacoes', foreignKey: 'usuario_id' });
Notificacao.belongsTo(Usuario, { as: 'usuario', foreignKey: 'usuario_id' });

// Notificacao -> Reserva opcional
Reserva.hasMany(Notificacao, { as: 'notificacoes', foreignKey: 'reserva_id' });
Notificacao.belongsTo(Reserva, { as: 'reserva', foreignKey: 'reserva_id' });

module.exports = {
  sequelize,
  Usuario,
  Sala,
  Equipamento,
  Disciplina,
  SalaEquipamento,
  Reserva,
  Participante,
  Notificacao,
};
