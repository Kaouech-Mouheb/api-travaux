const nodemailer = require("nodemailer");
const utilsJwt = require('../utils/jwt');
const db = require('../models');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // Port SMTP d'IONOS
    secure: true, // false car nous utilisons le port 587 (TLS)
    auth: {
        user: process.env.AUTH_USER_TRANSPORTER_EMAIL,
        pass: process.env.AUTH_PASS_TRANSPORTER_EMAIL
    }

});


// Route pour envoyer le PDF par e-mail

exports.updatePassword = async (req, res, next) => {
    try {
        const email = req.body.email;
        console.log(email);

        const user = await db.User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "Utilisateur non trouvé, veuillez vous enregistrer"
            });
        }

        const token = utilsJwt.generateTokenEmail(user); // Générez votre token ici

        const mailOptions = {
            from: process.env.AUTH_USER_TRANSPORTER_EMAIL,
            replyTo: process.env.AUTH_USER_TRANSPORTER_EMAIL,
            to: email,
            subject: 'Actualisez votre mot de passe',
            html: `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modifier Votre Mot de Passe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
        }
        hr {
            border: 1px solid #ccc;
        }
        p {
            color: #555;
            font-size: 16px;
        }
        a.button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Modifier Votre Mot de Passe</h1>
        <hr>
        <p>Cliquez sur le lien ci-dessous pour actualiser votre mot de passe :</p>
        <a href="${process.env.PORT}form/inscription/password?token=${token}&email=${email}" class="button">Réinitialiser le mot de passe</a>
        <p>Si le lien ci-dessus ne fonctionne pas, copiez et collez cette URL dans votre navigateur :</p>
        <p><code>${process.env.PORT}form/inscription/password?token=${token}&email=${email}</code></p>
    </div>
</body>
</html>

      `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('E-mail envoyé avec succès');
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
        res.status(500).send("Une erreur s'est produite lors de l'envoi de l'e-mail");
    }
};



exports.newPassword = async (req, res, next) => {
    try {
        const id = utilsJwt.getUserIdEmail(req.headers.authorization);
        if (Number.isNaN(id)) return res.status(400).end();

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Veuillez fournir une adresse e-mail et un mot de passe'
            });
        }

        const user = await db.User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé, veuillez vous enregistrer'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.User.update(
            { password: hashedPassword },
            {
                where: {
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

