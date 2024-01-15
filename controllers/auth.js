const bcrypt = require('bcrypt');
const db = require('../models');

const utilsJwt = require('../utils/jwt');
// LOGIQUE METIER //

exports.register = async (req, res, next) => {
    try {
        // Validation de la requête
        if (!req.body) {
            return res.status(400).send({
                message: "Veuillez remplir toutes les champs"
            });
        }

        // Vérification si l'utilisateur existe déjà
        const existingUser = await db.User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (existingUser) {
            return res.status(409).json({
                'error': 'Cet utilisateur existe déjà. Veuillez vous connecter.'
            });
        }

        // Hachage du mot de passe
        const hash = await bcrypt.hash(req.body.password, 10);

        const userHash = {
            ...req.body,
            password: hash
        };

        // Création de l'utilisateur dans la table User
        const createdUser = await db.User.create(userHash);

        // Récupération des informations du plan
        const planInfo = {
            abonnement: 'Gratuit',
            commence: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            UserId: createdUser.id,
        };

        // Ajout des informations du plan à la table Plan
        await db.Plan.create(planInfo);

        return res.status(201).json({
            'message': 'Votre compte est créé, et les informations du plan sont ajoutées !'
        });
    } catch (error) {
        return res.status(500).json({
            'error': error.message || 'Une erreur est survenue lors de la création du compte.'
        });
    }
};



exports.login = async (req, res, next) => {
    try {
        // Validation de la requête
        const userConnection = { ...req.body };
        if (!userConnection) {
            return res.status(400).json({
                'error': 'Veuillez remplir toutes les champs'
            });
        }

        // Vérification si l'utilisateur existe
        const user = await db.User.findOne({
            where: {
                email: userConnection.email
            }
        });

        if (!user) {
            return res.status(401).json({
                'message': 'Utilisateur non trouvé, veuillez vous enregistrer'
            });
        }

        // Comparaison sécurisée des mots de passe
        const valid = await bcrypt.compare(userConnection.password, user.password);

        if (!valid) {
            return res.status(403).json({
                'message': 'Mot de passe incorrect'
            });
        }

        // Génération du jeton JWT
        const token = utilsJwt.generateToken(user);

        res.status(200).json({
            'token': token
        });
    } catch (error) {
        return res.status(500).json({
            'error': error.message || 'Une erreur est survenue lors de la connexion.'
        });
    }
};

exports.updateNewPassword = async (req, res, next) => {
    try {
        const id = utilsJwt.getUserId(req.headers.authorization);
        if (Number.isNaN(id)) return res.status(400).end();

        const { ancienPassword, password, email } = req.body;

        const user = await db.User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Utilisateur non trouvé, veuillez vous enregistrer'
            });
        }

        const validPassword = await bcrypt.compare(ancienPassword, user.password);

        if (!validPassword) {
            return res.status(403).json({
                message: 'Mot de passe incorrect'
            });
        }

        const hashedNewPassword = await bcrypt.hash(password, 10);

        await db.User.update(
            { password: hashedNewPassword },
            {
                where: {
                    id: id,
                    email: email
                }
            }
        );

        return res.status(204).json({
            message: 'Mot de passe modifié avec succès !'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Une erreur s\'est produite lors de la modification du mot de passe'
        });
    }
};
exports.changePassword = async(req, res, next) =>{
    try {
        const id = utilsJwt.getUserId(req.headers.authorization);
        if (Number.isNaN(id)) return res.status(400).end();

        const { password, email } = req.body;

        const user = await db.User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Utilisateur non trouvé, veuillez vous enregistrer'
            });
        }

        const validPassword = await bcrypt.compare(ancienPassword, user.password);

        if (!validPassword) {
            return res.status(403).json({
                message: 'Mot de passe incorrect'
            });
        }

        const hashedNewPassword = await bcrypt.hash(password, 10);

        await db.User.update(
            { password: hashedNewPassword },
            {
                where: {
                    id: id,
                    email: email
                }
            }
        );

        return res.status(204).json({
            message: 'Mot de passe modifié avec succès !'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Une erreur s\'est produite lors de la modification du mot de passe'
        });
    }
}
exports.updateNewEmail = async (req, res, next) => {
    try {
        const id = utilsJwt.getUserId(req.headers.authorization);
        if (Number.isNaN(id)) return res.status(400).end();

        const { password, email } = req.body;

        const user = await db.User.findOne({
            where: {
                id: id
            }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Utilisateur non trouvé, veuillez vous enregistrer'
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(403).json({
                message: 'Mot de passe incorrect'
            });
        }
        await db.User.update(
            { email: email },
            {
                where: {
                    id: id,
                }
            }
        );

        return res.status(204).json({
            message: 'Email modifié avec succès !'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Une erreur s\'est produite lors de la modification du mot de passe'
        });
    }
};
exports.upedateProfil = async (req, res) => {
    try {
        const id = utilsJwt.getUserId(req.headers.authorization);
        if (Number.isNaN(id)) return res.status(400).end();

        const profil = {
            ...req.body
        };

        const user = await db.User.findOne({
            where: {
                id: id
            }

        });

        if (!user) {
            return res.status(401).json({
                message: 'Utilisateur non trouvé, veuillez vous enregistrer'
            });

        }
        await db.User.update(profil, {
            where: {
                id: id,
            }
        });
        return res.status(204).json({
            message: 'Mot de passe modifié avec succès !'
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Une erreur s\'est produite lors de la modification du mot de passe'
        });
    }
}
exports.getCompte = (req, res) => {
    //identification du demandeur
    const id = utilsJwt.getUserId(req.headers.authorization);
    if (Number.isNaN(id)) return res.status(400).end();
    db.User.findOne({

        attributes: {
            exclude: ["password"]
        },
        include: [{
            model: db.Plan,
        }],

        where: {
            id: id
        }
    })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json({
            'message': error
        }));
}
