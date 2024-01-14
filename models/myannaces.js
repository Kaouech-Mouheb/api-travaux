'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Myannance extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.Myannance.belongsTo(models.User, {
                onDelete: 'cascade',
                foreignKey: {
                  allowNull: false
                }, //   <-------------
                hooks: true
              })
        }
    };
    Myannance.init(
        {
            identifiant: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            bien: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            surface: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            client: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            tel: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Adresse: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: {
                        msg: "L'adresse e-mail doit être au format valide.",
                    },
                    notEmpty: {
                        msg: "L'adresse e-mail ne peut pas être vide.",
                    },
                },
            },
            cdPostal: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ville: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            projet: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            departement: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'Myannance',
        }
    );

    return Myannance;
};
