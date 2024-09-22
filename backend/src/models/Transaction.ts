import mongoose, { Schema } from 'mongoose'

const transactionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  data: { type: Date, required: true },
  valor: { type: Number, required: true },
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
})

const Transaction = mongoose.model('Transaction', transactionSchema)
export default Transaction
