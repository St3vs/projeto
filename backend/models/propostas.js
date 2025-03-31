/* /models/propostas.js
const mongoose = require('mongoose');

const propostasSchema = new mongoose.Schema({
   cliente: { type: String, required: true, unique: true },
   contacto: { type: String, required: true, unique: true },
   assunto: { type: String, required: true},
   descricao: { type: String, required: true},
   data: { type: Date, required: true},
   valor: { type: String, required: true},
   estado: { type: String, required: true}
}, { timestamps: true });


const Propostas = mongoose.model('Propostas', propostasSchema);
module.exports = Propostas;
*/

// /models/propostas.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Propostas = sequelize.define('Propostas', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  cliente: { type: DataTypes.STRING, allowNull: false },
  contacto: { type: DataTypes.STRING, allowNull: false },
  assunto: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.STRING, allowNull: false },
  data: { type: DataTypes.DATE, allowNull: false },
  valor: { type: DataTypes.STRING, allowNull: false },
  estado: { type: DataTypes.STRING, allowNull: false },
  idProjeto: { type: DataTypes.INTEGER, allowNull: true }
}, { timestamps: false });

module.exports = Propostas;
