const crypto = require('crypto');

function generateToken() {
  // Genera 3 bytes de datos aleatorios
  const bytes = crypto.randomBytes(6);
  
  // Convierte los bytes a un número entero
  const number = parseInt(bytes.readUIntBE(0, 6), 16);
  
  // Limita el número a 6 dígitos
  return Math.floor(number / 1000000) % 1000000;
}

// function generateSessionId() {
//   return crypto.randomBytes(16).toString('hex');
// }

module.exports = { generateToken};
