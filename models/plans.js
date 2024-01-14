'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Plan.belongsTo(models.User, {
        onDelete: 'cascade',
        foreignKey: {
          allowNull: false
        }, //   <-------------
        hooks: true
      })
    }
  };
  Plan.init({
    abonnement: {
      type: DataTypes.STRING,
      allowNull: false
    },
    commence: {
      type: DataTypes.STRING,
      allowNull: false
    }, isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }, productId: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Plan',
  });
  return Plan;
};
