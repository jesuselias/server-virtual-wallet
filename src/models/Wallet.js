const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  balance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', WalletSchema);
