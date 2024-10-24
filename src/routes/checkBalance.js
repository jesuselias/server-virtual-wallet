const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const User = require('../models/User');

async function checkBalance(document, phone) {
    console.log("Input parameters:", { document, phone });
    
    try {
        // Convert phone to the format stored in the database
        const formattedPhone = phone.replace(/^\+|\s+/g, '').replace(/\D/g, '');
        
        console.log("Formatted phone:", formattedPhone);

        // Buscamos el usuario por documento y teléfono exactamente
        const user = await User.findOne({ documento: document, celular: formattedPhone });
        
        if (!user) {
          throw new Error(`No se encontró un usuario con documento ${document} y teléfono ${formattedPhone}`);
        }

        console.log("Found user:", user._id);

        // Luego buscamos el wallet del usuario
        const wallet = await Wallet.findOne({ userId: user._id });

        if (!wallet) {
          throw new Error('No se encontró el wallet');
        }

        return wallet.balance;
    } catch (error) {
        console.error("Error en checkBalance:", error.message);
        throw error;
    }
}


router.get('/check-balance', async (req, res) => {
    try {
      const params = new URLSearchParams(req.url.split('?')[1]);
      const document = params.get('document');
      const fullPhone = params.get('fullPhone');

      console.log("Parsed parameters:", { document, fullPhone });

      // Verifica si fullPhone está definido
      if (!fullPhone) {
        throw new Error('Missing required parameter: fullPhone');
      }

      // Extraemos el prefijo "+" si está presente
      let phone = fullPhone.replace(/^[\+\s]+/, '');

      if (!document) {
        throw new Error('Missing required parameter: document');
      }

      console.log("Processed parameters:", { document, phone });

      const balance = await checkBalance(document, phone);
      
      res.json({ status: 'success', balance });
    } catch (error) {
      res.status(400).json({ message: 'Error al verificar saldo', details: error.message });
    }
});

module.exports = router;
