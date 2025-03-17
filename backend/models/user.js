/* /models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contacto: { type: String, unique: true },
    nif: { type: String, unique: true }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
module.exports = User;
*/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  contacto: { type: DataTypes.STRING, unique: true },
  nif: { type: DataTypes.STRING, unique: true }
}, { timestamps: false });

module.exports = User;
