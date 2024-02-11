'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Méthode d'aide pour définir les associations.
         * Cette méthode ne fait pas partie du cycle de vie de Sequelize.
         * Le fichier `models/index` appellera automatiquement cette méthode.
         */
        static associate(models) {
            // définir les associations ici
            models.User.hasOne(models.Plan, {
                onDelete: 'cascade',
                hooks: true
            });
            models.User.hasMany(models.Publication, {
                onDelete: 'cascade',
                hooks: true
            });
            models.User.hasMany(models.Myannance, {
                onDelete: 'cascade',
                hooks: true
            });
        }
    };
    User.init(
        {
            nombreAnnoncesAttribuees: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            companyName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            siretNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true, // Utilisez la validation isEmail pour vérifier le format de l'e-mail
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            logo: {
                type: DataTypes.JSON,
                allowNull: true,
              },
            couverture: {
                type: DataTypes.JSON,
                allowNull: true,

            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,

            },
            facebook: {
                type: DataTypes.STRING,
                allowNull: true,

            },
            whatsapp: {
                type: DataTypes.STRING,
                allowNull: true,

            },
            tel: {
                type: DataTypes.STRING,
                allowNull: true,

            },
            activite: {
                type: DataTypes.STRING,
                allowNull: true,

            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,

            },
            
            ville: {
                type: DataTypes.STRING,
                allowNull: false,

            },
            postalCode: {
                type: DataTypes.STRING,
                allowNull: false,

            },

            department: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'User',
        }
    );

    return User;
};
