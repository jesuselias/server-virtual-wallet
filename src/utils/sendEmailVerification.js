const nodemailer = require('nodemailer');
const crypto = require('crypto');

async function sendEmailVerification(token, userEmail, sessionId)  {
  
  try {

   console.log("sessionId", sessionId)
   console.log("token", token)

    // Configura el transporte
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, // Cambiado a 587 para STARTTLS
      secure: false, // Desactiva SSL
      auth: {
        user: 'jesus.e.elias.s@gmail.com',
        pass: 'cpmu fdpd rcnn oyxv' // Reemplaza por la contraseña de tu aplicación específica si creaste una
      },
      tls: {
        ciphers: 'ALL:!DH:!DES',
        secureProtocol: 'TLSv1_2_method'
      }
    });
    

    await transporter.sendMail({
      from: '"Página de Pago" <noreply@pantalla.com>',
      to: userEmail,
      subject: 'Verificación de Pago',
      html: `<b>Verificación de Pago</b><br><br>Por favor, ingrese el siguiente Id de sesión que debe ser usado en la confirmación de la compra:</b></b><br><br><strong>ID de Sesión: ${sessionId}</strong></b></b><br><br>Token: ${token}</b></b>`
    });

    // Resto del código...
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error;
  }
}

module.exports = sendEmailVerification;
