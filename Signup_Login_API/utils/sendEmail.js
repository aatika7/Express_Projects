const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const path = require('path');


// Create nodemailer transporter (From Mailtrap credentials)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE, // true for 465, false for other ports
    auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASSWROD,
        }
        });

// point to the template folder
transporter.use('compile', hbs({
    viewEngine: {
        partialsDir: path.resolve('./View/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./View/'),
}));

    // Send login confirmation email
 let sendEmail = async (email, firstName, subject, params) => {
    try {
        const mailInfo = await transporter.sendMail({
        from: "info@mailtrap.club",
        template: "email", // name of the template file inside 'email.handlebars'in View folder
        to: email,
        subject: subject + new Date().toLocaleString(),
        context: {
            name: firstName,
            params: params,
            },
               });
        console.log("Login confirmation email sent: ", mailInfo.messageId);
           }
    catch (emailError) {
    console.error("Error sending email: ", emailError,message);
    return response.status(500).json({ message: "Internal server error", error: error.message });
           }
 };      


 module.exports = {sendEmail};