const db = require('../models');
const Sequelize = require('sequelize');
const utilsJwt = require('../utils/jwt');
// LOGIQUE METIER //


exports.createAnnance = async (req, res, next) => {
  const annonce = {
    ...req.body
  };

  db.Annance
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

exports.getAnnonce = (req, res, next) => {
  const userId = utilsJwt.getUserId(req.headers.authorization);
  if (Number.isNaN(userId)) {
    return res.status(400).json({
      'message': 'ID utilisateur non valide'
    });
  }

  db.Annance.findAll({
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

exports.updateAnnonce = async (req, res, next) => {
  const annonceId = req.params.id;

  try {
    // Récupérer la valeur actuelle de nombrePartages depuis la base de données
    const annonce = await db.Annance.findByPk(annonceId);
    const currentNombrePartages = annonce ? annonce.nombrePartages : 0;

    // Incrémenter de 1
    const newNombrePartages = currentNombrePartages + 1;

    await db.Annance.update(
      { nombrePartages: newNombrePartages },
      {
        where: {
          id: annonceId,
        }
      }
    );

    return res.status(204).json({
      message: 'Mot de passe modifié avec succès !'
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de nombrePartages:', error);
    return res.status(500).json({
      'message': 'Une erreur s\'est produite lors de la récupération de nombrePartages'
    });
  }
};

