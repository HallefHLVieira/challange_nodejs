import mongoose, { Schema } from 'mongoose';

const clienteSchema = new Schema({
  nome: { type: String, required: true },
  cpfCnpj: { type: String, required: true, unique: true }, // Índice único
  transacoes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }] // Array de referências de transações
});

const Cliente = mongoose.model('Client', clienteSchema);

export default Cliente;
