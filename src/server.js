require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Cambia esto según tu frontend
  credentials: true
}));
app.use(express.json());

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({ message: err.message });
});

// Importar y usar la función de conexión
const connectDB = require('./database/db');

connectDB();

// Importar rutas
const registerRoutes = require('./routes/register');
const profileRoutes = require('./routes/profile');

// Usar las rutas
app.use('/api/register', registerRoutes);
app.use('/api/user', profileRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
