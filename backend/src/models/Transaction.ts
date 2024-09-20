import mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema({
  id: { type: String, required: true, unique: true }, // Identificador único
  data: { type: Date, required: true },
  valor: { type: Number, required: true },
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true } // Relacionamento com cliente
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;