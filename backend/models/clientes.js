/* /models/clientes.js
const mongoose = require('mongoose');

const clientesSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    contacto: { type: String, required: true, unique: true },
    nif: { type: String, required: true, unique: true },
    morada: { type: String, required: true},
    cp: { type: String, required: true},
    localidade: { type: String, required: true}
}, { timestamps: true });


const Clientes = mongoose.model('Clientes', clientesSchema);
module.exports = Clientes;
*/

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
