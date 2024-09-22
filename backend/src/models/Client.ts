import mongoose, { Schema } from 'mongoose'

const clienteSchema = new Schema({
  nome: { type: String, required: true },
  cpfCnpj: { type: String, required: true, unique: true },
  transacoes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
})

const Cliente = mongoose.model('Client', clienteSchema)

export default Cliente
