const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './config/projeto.db',
    logging: false, 
});

module.exports = sequelize;
