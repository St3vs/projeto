// /models/obras.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Obras = sequelize.define('Obras', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  clienteId: { type: DataTypes.INTEGER, allowNull: false },
  descricao: { type: DataTypes.STRING, allowNull: false },
  data: { type: DataTypes.DATE, allowNull: false },
  valorProposta: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  valorFaturado: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  dataUltimaFatura: { type: DataTypes.DATE, allowNull: false },
}, { timestamps: false });

Obras.associate = (models) => {
   Obras.belongsTo(models.Clientes, { foreignKey: 'clienteId', as: 'cliente' });
   Obras.hasMany(models.Encomendas, { foreignKey: 'obraId', as: 'encomendas' });
};

module.exports = Obras;
