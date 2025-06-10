const Sequelize = require('sequelize');
const sequelize = require('../config/config');

const Encomendas = require('./encomendas');
const Obras = require('./obras');
const Fornecedores = require('./fornecedores');
const Clientes = require('./clientes');
const Propostas = require('./propostas');
const Projeto = require('./projetos');

const models = {
  Sequelize,
  sequelize,
  Encomendas,
  Obras,
  Fornecedores,
  Clientes,
  Propostas,
  Projeto,
};

// Executa as associações
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

module.exports = {
  ...models,
  sequelize,
  Sequelize,
};
