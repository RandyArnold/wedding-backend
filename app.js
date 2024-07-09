const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
require('dotenv').config()

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.TRANSPORTER_HOST,
    port: process.env.TRANSPORTER_PORT,
    secure: process.env.TRANSPORTER_SECURE,
    auth: {
        user: process.env.TRANSPORTER_AUTH_USER,
        pass: process.env.TRANSPORTER_AUTH_PASSWORD,
    },
});


app.use(express.json())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}))

app.post('/register', async (req, res) => {
    console.log(req.body)

    mailOptions.text = JSON.stringify(req.body);

    sendEmail(req.body)
        .then(() => res.send({ok: true}))
        .catch((error) => {
            console.log(error);
            res.send({ok: false})
        });
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: 'Nouvelle inscription au mariage',
};

async function sendEmail(data) {
    const confirmationMailOptions = {
        from: process.env.EMAIL_FROM,
        to: data.email,
        subject: data.locale = 'fr-Fr' ? getFrenchSubject() : getGermanSubject(),
        text: data.locale = 'fr-Fr' ? getFrenchText(data) : getGermanText(data)
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                reject(error);
            }

            transporter.sendMail(confirmationMailOptions, function (error, info) {
                if (error) {
                    reject(error);
                    console.log(error);
                }
                resolve();
            })
        });
    })
}

const getGermanSubject = () => {
    return 'Anmeldebestätigung';
}

const getGermanText = (data) => {
    return `Vielen Dank für die Anmeldung, Wir sind sehr glücklich, diesen Tag mit dir zu verbringen.
    
Hier nochmals die Zusammenfassung: 
    - Essgewohnheiten : ${data.diet}
    - Allergien : ${data.allergies ? data.allergies : 'aucune'}
    - Übernachtung : ${data.lodging}
        
Falls du etwas ändern möchtest, schreib uns bitte eine Nachricht.
        
Bisous ❤️
Corin & Phippu`
}

const getFrenchSubject = () => {
    return 'Confirmation';
}

const getFrenchText = (data) => {
    return `Merci beaucoup pour l’inscription. On est très heureux de passer cette journée avec toi.
    
Voici le récapitulatif : 
    - Habitudes alimentaires : ${data.diet}
    - Alergies : ${data.allergies ? data.allergies : 'aucune'}
    - Logement : ${data.lodging}
        
Si tu souhaites changer quelque chose, envoie-nous un message
        
Bisous ❤️
Corin & Philipp️`

}
