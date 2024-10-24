const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware de autenticación (sin token)
router.use((req, res, next) => {
  const userId = req.query._id;
  if (!userId) {
    return res.status(400).json({ message: 'ID de usuario no proporcionado' });
  }
    
  next();
});

// Ruta para obtener el perfil del usuario
router.get('/profile', async (req, res) => {
  try {
    const userId = req.query._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener perfil del usuario' });
  }
});

module.exports = router;
