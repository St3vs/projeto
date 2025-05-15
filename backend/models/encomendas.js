// /models/encomendas.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Encomendas = sequelize.define('Encomendas', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fornecedor: { type: DataTypes.STRING, allowNull: false },
  contacto: { type: DataTypes.STRING, allowNull: false },
  descricaoMaterial: { type: DataTypes.STRING, allowNull: false },
  data: { type: DataTypes.DATE, allowNull: false },
  previsaoEntrega: { type: DataTypes.DATE, allowNull: false },
  valor: { type: DataTypes.STRING, allowNull: false },
  observacoes: { type: DataTypes.STRING, allowNull: true },
}, { timestamps: false });

module.exports = Encomendas;