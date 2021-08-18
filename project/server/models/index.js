'use strict';

require('dotenv').config();
const POSTGRES_URI = 'postgres://localhost:5432/thaerbraizat';
const { Sequelize, DataTypes } = require('sequelize');


const userSchema = require('./userSchema');
const order = require('./listSchema');

let sequelize = new Sequelize(POSTGRES_URI);

const userModel = userSchema(sequelize, DataTypes);
const orderModel = order(sequelize, DataTypes);

userModel.hasMany(orderModel, { foreignKey: 'customerId', sourceKey: 'id'});
orderModel.belongsTo(userModel, { foreignKey: 'customerId', targetKey: 'id'});






module.exports = {
  db: sequelize,
  userModel: userModel,
  orderModel: orderModel
}