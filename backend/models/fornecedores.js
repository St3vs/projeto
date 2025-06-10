/* /models/fornecedores.js
const mongoose = require('mongoose');

const fornecedoresSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    contacto: { type: String, required: true, unique: true },
    nif: { type: String, required: true, unique: true },
}, { timestamps: true });


const Fornecedores = mongoose.model('Fornecedores', fornecedoresSchema);
module.exports = Fornecedores;
*/

// models/fornecedores.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Fornecedores = sequelize.define("Fornecedores", {
   id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
   username: { type: DataTypes.STRING, allowNull: false, unique: true },
   email: { type: DataTypes.STRING, allowNull: false, unique: true },
   contacto: { type: DataTypes.STRING, allowNull: false, unique: true },
   nif: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { timestamps: false });

Fornecedores.associate = (models) => {
   Fornecedores.hasMany(models.Encomendas, { foreignKey: 'fornecedorId', as: 'encomendas' });
};

module.exports = Fornecedores;

