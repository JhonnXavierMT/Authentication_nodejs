const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config()
// Create a transporter for SMTP gestor de conexion
const transporter = nodemailer.createTransport({
    /* service:"gmail", */
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function enviarEmail(direccion, token,text_html) {
    try {
        return await transporter.sendMail({
            from: '"Jhonn dev" <jhonnmtxavier@gmail.com>', // sender address
            to: direccion, // list of receivers
            subject: "Verificacion de nueva cuenta", // Subject line
            html: text_html(token), // html body
        });
    } catch (err) {
        console.error("Error al enviar mail", err);
    }
}

function crear_html(token) {
    return `<!DOCTYPE html>
<html lang="en">
<body>
    <h1>Verificacion de correo elecronico</h1>
    <p> Si usted esta tratando de crear una cuenta en dashborad entonces: </p>
    <p>De click en el enlace para confirmar <a href="http://localhost:3000/verificar/${token}">click para confirmar</a> </p>
</body>
</html>`
}

function crear_html_rec_Password(token) {
    return `<!DOCTYPE html>
<html lang="en">
<body>
    <h1>Usted recibio un codigo para recetear su Password</h1>
    <p>Su codigo generado es: </p>
    <h2>👉 ${token}</h2>
</body>
</html>`
}
module.exports = {enviarEmail,crear_html,crear_html_rec_Password}