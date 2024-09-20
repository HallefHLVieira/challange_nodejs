import mongoose, { Document, Schema } from 'mongoose';

interface ITransaction extends Document {
  id: string;
  nome: string;
  cpfCnpj: string;
  data: Date;
  valor: number;
}

const transactionSchema: Schema = new Schema({
  id: { type: String, required: true },
  nome: { type: String, required: true },
  cpfCnpj: { type: String, required: true },
  data: { type: Date, required: true },
  valor: { type: Number, required: true },
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);