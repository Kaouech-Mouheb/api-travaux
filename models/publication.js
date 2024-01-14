
'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Publication extends Model {
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
    Publication.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }, img: {
            type: DataTypes.JSON,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Publication',
    });
    return Publication;
};
