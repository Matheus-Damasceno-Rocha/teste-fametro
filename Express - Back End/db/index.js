const { Sequelize } = require('sequelize');

// Prefer DATABASE_URL; fallback to discrete PG_* vars
const databaseUrl = process.env.DATABASE_URL;

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: false,
    })
  : new Sequelize(
      process.env.PG_DB || 'clee',
      process.env.PG_USER || 'postgres',
      process.env.PG_PASSWORD || 'postgres',
      {
        host: process.env.PG_HOST || 'localhost',
        port: Number(process.env.PG_PORT || 5432),
        dialect: 'postgres',
        logging: false,
      }
    );

module.exports = { sequelize };
