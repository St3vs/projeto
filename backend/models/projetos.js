//models/projetos.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Projeto = sequelize.define('Projeto', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  cliente: { type: DataTypes.STRING, allowNull: false },
  assunto: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.STRING, allowNull: false },
  dataInicio: { type: DataTypes.DATE, allowNull: false },
  valor: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });

module.exports = Projeto;
