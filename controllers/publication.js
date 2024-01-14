const db = require('../models');
const Sequelize = require('sequelize');
const utilsJwt = require('../utils/jwt');
// LOGIQUE METIER //
exports.createPublication = (req, res, next) => {
    const userId = utilsJwt.getUserId(req.headers.authorization);
    if (Number.isNaN(userId)) {
        return res.status(400).json({
            'message': 'ID utilisateur non valide'
        });
    }

    const publication = {
        UserId: userId,
        ...req.body
    };

    db.Publication
        .create(publication)
        .then(() => {
            return res.status(201).json({
                'message': 'publication ajouté'
            });
        })
        .catch(error => {
            console.error('Erreur lors de la création de l\'événement:', error);
            return res.status(500).json({
                'message': 'Une erreur s\'est produite lors de la création de l\'événement'
            });
        });
};

exports.getPublication = (req, res, next) => {
    const userId = utilsJwt.getUserId(req.headers.authorization);
    if (Number.isNaN(userId)) {
        return res.status(400).json({
            'message': 'ID utilisateur non valide'
        });
    }

    db.Publication.findAll({
        order: Sequelize.literal('updatedAt DESC'),
        where: {
            UserId: userId
        }
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


exports.deletePublication = (req, res, next) => {
    const userId = utilsJwt.getUserId(req.headers.authorization);
    if (Number.isNaN(userId)) {
        return res.status(400).json({
            'message': 'ID utilisateur non valide'
        });
    }

    const eventId = req.params.id;

    db.Publication.destroy({
        where: {
            id: eventId,
            UserId: userId
        }
    })
        .then(affectedRows => {
            if (affectedRows === 0) {
                return res.status(404).json({
                    'message': 'Événement non trouvé'
                });
            }
            res.status(204).json({
                'message': 'Événement supprimé'
            });
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'événement:', error);
            return res.status(500).json({
                'message': 'Une erreur s\'est produite lors de la suppression de l\'événement'
            });
        });
};

