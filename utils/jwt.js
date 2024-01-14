/*Gestion de jwt*/

//import
let jwt = require('jsonwebtoken')

module.exports = {
    tokenSign: process.env.SECRET_KEY,
    tokenSignEmail: process.env.SECRET_KEY_EMAIL,



    //Générer le token
    generateToken: function (user) {
        return jwt.sign({
            userId: user.id
        },
            this.tokenSign,
            {
                expiresIn: '720h'
            })
    },

    //récupérer le userId via le token
    getUserId: function (data) {
        if (data.length > 1) {
            let token = data.split(' ')[1];
            try {
                let decodedToken = jwt.verify(token, this.tokenSign)
                let userId = decodedToken.userId
                return userId
            }
            catch (err) {
                return err
            }
        };
    },

    generateTokenEmail: function (user) {
        return jwt.sign({
            userId: user.id
        },
            this.tokenSignEmail,
            {
                expiresIn: '24h'
            })
    },

    //récupérer le userId via le token
    getUserIdEmail: function (data) {
        if (data.length > 1) {
            let token = data.split(' ')[1];
            try {
                let decodedToken = jwt.verify(token, this.tokenSignEmail)
                let userId = decodedToken.userId
                return userId
            }
            catch (err) {
                return err
            }
        };
    },


}
