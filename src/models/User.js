const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  documento: { type: String, required: true },
  nombres: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  celular: { type: String, required: true },
  roles: [{ type: String, enum: ['administrador', 'moderador', 'cliente'], default: 'cliente' }]
});

module.exports = mongoose.model('User', UserSchema);
