const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const { documento, nombres, email, celular } = req.body;

    // Función auxiliar para limpiar el número de teléfono
    const cleanPhoneNumber = (phone) => {
      return phone.replace(/^\+|\s+/g, '').replace(/\D/g, '');
    };

    const cleanedCelular = cleanPhoneNumber(celular);

    await User.create({
      documento,
      nombres,
      email,
      celular: cleanedCelular,
      roles: ['cliente']
    });

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

module.exports = router;
