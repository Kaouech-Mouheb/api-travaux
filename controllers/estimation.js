const nodemailer = require("nodemailer");

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
exports.envoyerEstimation = async (req, res) => {

    const email = req.body.contenu;
    const img = req.body.img
    console.log(img)
    console.log(email)
    // Créer un flux lisible à partir des données binaires

    const mailOptions = {
        from: process.env.AUTH_USER_TRANSPORTER_EMAIL,
        replyTo: 'contact@expressdevis.com',
        to: 'contact@expressdevis.com',
        subject: 'Demande pour estimation en ligne des travaux',
        html: email,

    };

    try {
        // Envoyer l'e-mail
        await transporter.sendMail(mailOptions);
        res.status(200).send('E-mail envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        res.status(500).send('Une erreur s\'est produite lors de l\'envoi de l\'e-mail');
    }
};

exports.envoyerMessage = async (req, res) => {

    const email = req.body.contenu;
    console.log(email)
    // Créer un flux lisible à partir des données binaires

    const mailOptions = {
        from: process.env.AUTH_USER_TRANSPORTER_EMAIL,
        replyTo: 'contact@expressdevis.com',
        to: 'contact@expressdevis.com',
        subject: 'Demande du contact',
        html: email,

    };

    try {
        // Envoyer l'e-mail
        await transporter.sendMail(mailOptions);
        res.status(200).send('E-mail envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        res.status(500).send('Une erreur s\'est produite lors de l\'envoi de l\'e-mail');
    }
};