'use strict';

require('dotenv').config();
const POSTGRES_URI =process.env.DATABASE_URL ;
const { Sequelize, DataTypes } = require('sequelize');
let sequelizeOptions = {
  dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
};

const userSchema = require('./userSchema');
const order = require('./listSchema');

let sequelize = new Sequelize(POSTGRES_URI,sequelizeOptions);

const userModel = userSchema(sequelize, DataTypes);
const orderModel = order(sequelize, DataTypes);

userModel.hasMany(orderModel, { foreignKey: 'customerId', sourceKey: 'id'});
orderModel.belongsTo(userModel, { foreignKey: 'customerId', targetKey: 'id'});






module.exports = {
  db: sequelize,
  userModel: userModel,
  orderModel: orderModel
}