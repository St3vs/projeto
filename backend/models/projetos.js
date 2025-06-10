//models/projetos.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Projeto = sequelize.define('Projeto', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  clienteId: { type: DataTypes.STRING, allowNull: false },
  assunto: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.STRING, allowNull: false },
  dataInicio: { type: DataTypes.DATE, allowNull: false },
  valor: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });

Projeto.associate = function(models) {
  Projeto.belongsTo(models.Clientes, { foreignKey: 'clienteId', as: 'cliente' });
  Projeto.hasOne(models.Propostas, { foreignKey: 'idProjeto', as: 'proposta' });
};

module.exports = Projeto;
