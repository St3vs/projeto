// /models/propostas.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Propostas = sequelize.define('Propostas', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  clienteId: { type: DataTypes.STRING, allowNull: false },
  assunto: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.STRING, allowNull: false },
  data: { type: DataTypes.DATE, allowNull: false },
  valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  estado: { type: DataTypes.STRING, allowNull: false },
  idProjeto: { type: DataTypes.INTEGER, allowNull: true }
}, { timestamps: false });

Propostas.associate = function(models) {
  Propostas.belongsTo(models.Clientes, { foreignKey: 'clienteId', as: 'cliente' });
  Propostas.belongsTo(models.Projeto, { foreignKey: 'idProjeto', as: 'projeto' });
};

module.exports = Propostas;
