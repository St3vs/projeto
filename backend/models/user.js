/* /models/user.js*/
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  contacto: { type: DataTypes.STRING, unique: true },
  nif: { type: DataTypes.STRING, unique: true },
  fotoPerfil: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: false });

module.exports = User;
