const db = require('../models');
const utilsJwt = require('../utils/jwt');
const nodemailer = require("nodemailer");


// section email expiré 
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT, // Port SMTP d'IONOS
  secure: true, // false car nous utilisons le port 587 (TLS)
  auth: {
    user: process.env.AUTH_USER_TRANSPORTER_EMAIL,
    pass: process.env.AUTH_PASS_TRANSPORTER_EMAIL
  }

});


exports.miseAjour = (req, res) => {
  const id = utilsJwt.getUserId(req.headers.authorization);
  if (Number.isNaN(id)) {
    return res.status(400).end();
  }
  const plan = {
    ...req.body
  }
  db.Plan.update(plan, {
    where: {
      UserId: id
    }
  }).then(() => {
    return res.status(204).json({
      'message': 'plan mofifié'
    })
  }).catch(e => {
    return res.json({
      'message': e
    })
  })
}
// abonnenemt expiré 
exports.miseAjourState = async (req, res) => {
  try {
    const id = utilsJwt.getUserId(req.headers.authorization);
    if (Number.isNaN(id)) {
      return res.status(400).end();
    }

    const plan = {
      ...req.body
    };

    await db.Plan.update(plan, {
      where: {
        UserId: id
      }
    });

    const user = await db.User.findOne({
      where: {
        id: id
      }
    });

    if (!user) {
      return res.status(401).json({
        message: "Utilisateur non trouvé, veuillez vous enregistrer"
      });
    }

    const emailTo = user.email;
    const userName = user.denominationSocial;

    const mailOptions = {
      from: process.env.AUTH_USER_TRANSPORTER_EMAIL,
      to: emailTo,
      subject: 'Abonnement Expiré !',
      html: `
      <!DOCTYPE html>
    <html lang="fr">
    <head>
       <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Votre Abonnement a Expiré</title>
    </head>
    <body>
      <h1>Votre Abonnement a Expiré</h1>

      <p>Cher(e) client(e) ${userName},</p>

      <p>Nous espérons que vous allez bien. Nous tenons à vous informer que votre abonnement à notre service a récemment expiré. Nous tenons à vous rappeler l'importance de renouveler votre abonnement pour continuer à profiter de tous les avantages que nous offrons.</p>

      <p><strong>Date d'Expiration de l'Abonnement :</strong> ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
      <p><strong>État de l'Abonnement :</strong> Expiré</p>

      <h2>Que Fait Cela Signifie ?</h2>

      <p>L'expiration de votre abonnement signifie que vous n'avez actuellement plus accès à notre service.</p>


      <h2>Comment Renouveler Votre Abonnement :</h2>

      <p>Renouveler votre abonnement est rapide et facile. Voici les étapes à suivre pour réactiver votre compte :</p>

      <ol>
      <li>Connectez-vous à votre compte sur notre site web.</li>
      <li>Accédez à la section "Gestion de l'Abonnement".</li>
      <li>Sélectionnez l'option de renouvellement appropriée pour la durée de votre choix.</li>
      <li>Procédez au paiement en utilisant l'une des options de paiement acceptées.</li>
    </ol>

      <p>Dès que votre paiement sera confirmé, votre abonnement sera réactivé, et vous pourrez reprendre l'utilisation de notre service sans interruption.</p>

      h2>Besoin d'Aide ?</h2>

      <p>Si vous avez des questions ou si vous avez besoin d'aide pour renouveler votre abonnement, n'hésitez pas à contacter notre équipe de support client dédiée. Nous sommes là pour vous aider à résoudre tout problème que vous pourriez rencontrer.</p>

      <p><strong>Contactez-nous :</strong></p>
    <ul>
     <li>Téléphone : [Numéro de Téléphone du Support Client]</li>
     <li>E-mail : <a href="mailto:[Adresse E-mail du Support Client]">[Adresse E-mail du Support Client]</a></li>
     <li>Chat en Direct : <a href="[Lien vers le Chat en Direct sur notre Site Web]">[Lien vers le Chat en Direct sur notre Site Web]</a></li>
    </ul>

      <p>Nous vous remercions de votre confiance en notre service, et nous sommes impatients de continuer à vous servir. Ne laissez pas l'interruption de votre abonnement vous priver des avantages que nous offrons. Renouvelez dès maintenant et continuez à profiter de tout ce que nous avons à offrir.</p>

    <p>Cordialement,</p>
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
