const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const { documento, nombres, email, celular } = req.body;

    const newUser = await User.create({
      documento,
      nombres,
      email,
      celular,
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
