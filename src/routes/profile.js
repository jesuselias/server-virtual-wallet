const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Asegúrate de que el path sea correcto

// Middleware de autenticación
router.use((req, res, next) => {
  const token = req.headers['authorization'];
  console.log("token", token);

  if (!token) return res.status(403).json({ message: 'No token provided' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = decoded.userId; // Cambiado a decoded.userId
    next();
  });
});

// Ruta para obtener el perfil del usuario
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener perfil del usuario' });
  }
});

module.exports = router;
