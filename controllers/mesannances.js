const db = require('../models');
const Sequelize = require('sequelize');
const utilsJwt = require('../utils/jwt');
// LOGIQUE METIER //
exports.createMesannance = (req, res, next) => {

    const userId = utilsJwt.getUserId(req.headers.authorization);
    if (Number.isNaN(userId)) {
        return res.status(400).json({
            'message': 'ID utilisateur non valide'
        });
    }
    const annonce = {
        UserId: userId,
        ...req.body
    };

    db.Myannance
        .create(annonce)
        .then(() => {
            return res.status(201).json({
                'message': 'Annonce ajouté'
            });
        })
        .catch(error => {
            console.error('Erreur lors de la création de l\'événement:', error);
            return res.status(500).json({
                'message': 'Une erreur s\'est produite lors de la création de l\'événement'
            });
        });
};

exports.getMesannance = (req, res, next) => {
    const userId = utilsJwt.getUserId(req.headers.authorization);
    if (Number.isNaN(userId)) {
        return res.status(400).json({
            'message': 'ID utilisateur non valide'
        });
    }

    db.Myannance.findAll({
        order: Sequelize.literal('updatedAt DESC'),

    })
        .then(annonce => {
            if (annonce.length === 0) {
                return res.status(200).json({
                    'message': 'Aucun événement trouvé',
                    'events': []
                });
            }
            res.status(200).json(annonce);
        })
        .catch(error => res.status(500).json({
            'message': 'Erreur lors de la récupération des événements'
        }));
};
exports.getOneMesannance = (req, res, next) => {
    const userId = utilsJwt.getUserId(req.headers.authorization);
    if (Number.isNaN(userId)) {
        return res.status(400).json({
            'message': 'ID utilisateur non valide'
        });
    }

    db.Myannance.findOne({
        where: {
            identifiant: req.params.id,
        },
        order: Sequelize.literal('updatedAt DESC'),

    })
        .then(annonce => {
            if (annonce.length === 0) {
                return res.status(200).json({
                    'message': 'Aucun événement trouvé',
                    'events': []
                });
            }
            res.status(200).json(annonce);
        })
        .catch(() => res.status(500).json({
            'message': 'Erreur lors de la récupération des événements'
        }));
};






