'use strict';

const order = (sequelize, DataTypes) => sequelize.define('order', {
  note: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = order;