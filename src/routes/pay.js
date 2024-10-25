const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const sendEmailVerification = require('../utils/sendEmailVerification');

// Función para limpiar el número de teléfono
const cleanPhoneNumber = (phone) => {
  return phone.replace(/^\+|\s+/g, '').replace(/\D/g, '');
};

// Función para enviar correo electrónico y confirmar pago
async function handlePayment(req, res) {
  try {
    const { documento, celular, valor } = req.body;
    
    // Verifica que todos los campos sean válidos y estén presentes
    if (!documento || !celular || !valor) {
      return res.status(400).json({ message: 'Faltan datos necesarios' });
    }

    // Convierte valor a número decimal
    const valorDecimal = parseFloat(valor);

    // Limpia el número de teléfono
    const cleanedCelular = cleanPhoneNumber(celular);

    // Busca el usuario por documento y celular limpio
    const user = await User.findOne({ documento: documento, celular: cleanedCelular });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Busca el wallet del usuario
    let wallet = await Wallet.findOne({ userId: user._id });

    // Si no existe el wallet, crea uno con un valor inicial
    if (!wallet) {
      wallet = new Wallet({ userId: user._id, balance: 0 });
    }

    // Genera token de 6 dígitos
    const token = generateToken();

    // Envía correo electrónico con el token
    sendEmailVerification(token, user.email, wallet._id.toString());

    // Guarda el token en la base de datos junto con el estado de verificación
    wallet.token = token;
    
    // Guarda los cambios en la base de datos
    await wallet.save();

    res.status(200).json({
      "message": "Se ha enviado un correo electrónico con éxito. \n\nEn él encontrará un ID de sesión para verificar la compra.",
      "success": true
    }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar el pago' });
  }
}

// Ruta para iniciar el proceso de pago
router.post('/pay-email', handlePayment);

// Función para confirmar el pago
async function confirmPayment(req, res) {
  try {
    const { sessionId, valor } = req.body;

    const valorDecimal = parseFloat(valor);
    
    console.log("sessionId", sessionId);

    if (!sessionId) {
      return res.status(400).json({ message: 'Falta el ID de sesión' });
    }

    // Busca el wallet asociado al id de sesión
    let wallet = await Wallet.findOne({ _id: sessionId });

    if (!wallet) {
      wallet = new Wallet({ userId: sessionId, balance: 0 });
    }

    // Actualiza el saldo en la base de datos
    wallet.balance -= valorDecimal;
    
    // Guarda los cambios en la base de datos
    await wallet.save();

    // Obtiene el nuevo saldo del usuario
    const newUserBalance = await User.findById(wallet.userId).select('balance');

    // Actualiza el saldo del usuario
    await User.findByIdAndUpdate(wallet.userId, { balance: newUserBalance.balance - valorDecimal }, { new: true });

    res.status(200).json({ success: true, message: 'Pago confirmado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al confirmar el pago', error: error.message });
  }
}

// Ruta para confirmar el pago
router.post('/confirm-payment', confirmPayment);

module.exports = router;
