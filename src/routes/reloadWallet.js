const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const User = require('../models/User');

router.post('/reload-wallet', async (req, res) => {
  try {
    const { documento, celular, valor } = req.body;

    // Verifica que todos los campos sean válidos y estén presentes
    if (!documento || !celular || !valor) {
      return res.status(400).json({ message: 'Faltan datos necesarios' });
    }

    // Convierte valor a número decimal
    const valorDecimal = parseFloat(valor);

    // Busca el usuario por documento
    const user = await User.findOne({ documento });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verifica si el valor de entrada es válido
    if (isNaN(valorDecimal)) {
      return res.status(400).json({ message: 'Valor inválido' });
    }

    // Busca el wallet del usuario
    let wallet = await Wallet.findOne({ userId: user._id });

    // Si no existe el wallet, crea uno con un valor inicial
    if (!wallet) {
      wallet = new Wallet({ userId: user._id, balance: 0 });
    }

    // Actualiza el saldo en la base de datos
    wallet.balance += valorDecimal;
    
    // Guarda los cambios en la base de datos
    await wallet.save();

    // Actualiza el saldo del usuario
    await User.findByIdAndUpdate(user._id, { balance: wallet.balance }, { new: true });

    res.status(200).json({ message: 'Billetera recargada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al recargar la billetera' });
  }
});

module.exports = router;
