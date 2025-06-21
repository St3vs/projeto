// /models/encomendas.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Encomendas = sequelize.define('Encomendas', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fornecedorId: { type: DataTypes.INTEGER, allowNull: false },
  obraId: { type: DataTypes.INTEGER, allowNull: false },
  descricaoMaterial: { type: DataTypes.STRING, allowNull: false },
  data: { type: DataTypes.DATE, allowNull: false },
  previsaoEntrega: { type: DataTypes.DATE, allowNull: false },
  valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  observacoes: { type: DataTypes.STRING, allowNull: true },
}, { timestamps: false });

Encomendas.associate = (models) => {
   Encomendas.belongsTo(models.Obras, { foreignKey: 'obraId', as: 'obra' });
   Encomendas.belongsTo(models.Fornecedores, { foreignKey: 'fornecedorId', as: 'fornecedor' });
};

module.exports = Encomendas;
