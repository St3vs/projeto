/* /models/clientes.js 
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Cliente = sequelize.define('Cliente', {
   id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
   username: { type: DataTypes.STRING, allowNull: false, unique: true },
   email: { type: DataTypes.STRING, allowNull: false, unique: true },
   contacto: { type: DataTypes.STRING, allowNull: false, unique: true },
   nif: { type: DataTypes.STRING, allowNull: false, unique: true },
   morada: { type: DataTypes.STRING, allowNull: false },
   cp: { type: DataTypes.STRING, allowNull: false },
   localidade: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false});

module.exports = Cliente;
*/
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Clientes = sequelize.define('Clientes', {
   id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
   username: { type: DataTypes.STRING, allowNull: false, unique: true },
   email: { type: DataTypes.STRING, allowNull: false, unique: true },
   contacto: { type: DataTypes.STRING, allowNull: false, unique: true },
   nif: { type: DataTypes.STRING, allowNull: false, unique: true },
   morada: { type: DataTypes.STRING, allowNull: false },
   cp: { type: DataTypes.STRING, allowNull: false },
   localidade: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });

Clientes.associate = (models) => {
   Clientes.hasMany(models.Obras, { foreignKey: 'clienteId', as: 'obras' });
   Clientes.hasMany(models.Propostas, { foreignKey: 'clienteId', as: 'propostas' });
   Clientes.hasMany(models.Projeto, { foreignKey: 'clienteId', as: 'projetos' });
};

module.exports = Clientes;

