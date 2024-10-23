const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Asegúrate de importar el módulo jwt

router.post('/', async (req, res) => {
  try {
    const { documento, nombres, email, celular, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      documento,
      nombres,
      email,
      celular,
      password: hashedPassword,
      roles: ['user']
    });

    // Generar token JWT
    const token = jwt.sign(
      { userId: newUser._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expirará en 1 hora
    );

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      userId: newUser._id,
      token: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

module.exports = router;
