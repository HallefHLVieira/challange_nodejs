import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import Transaction from './models/Transaction';
import dotenv from 'dotenv'

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// MongoDB configs
// TODO: convert in envs
mongoose.connect('mongodb://hadmin:hadmin123@localhost:27017/tonline')
  .then(() => console.log('MongoDB conection ON 🚀️'))
  .catch(err => console.error('error to connect to MongoDB 😓️', err));

// Multer config to upload files
const storage = multer.memoryStorage();
const upload = multer({ storage });

// My routes
// TODO: create route files after
app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('A file is required. 🧐️');
  }

  const content = req.file.buffer.toString();
  const records = content.split('\n');

  const transactions = records.map(record => {
    const [id, nome, cpfCnpj, data, valor] = record.split(';');

    return {
      id,
      nome,
      cpfCnpj,
      data: new Date(data),
      valor: parseFloat(valor),
    };
  });

  try {
    for ( const transaction of transactions ){
      const alreadyExistsTransaction = await Transaction.findOne({ id: transaction.id });

      if(!alreadyExistsTransaction) {
        await Transaction.create(transaction);
      } else {
        console.log(`Transaction with id: ${transaction.id} alredy exists.`);
        
      }
    }
    res.status(200).send('Success! 😎️');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error to save transactions. 🤯️');
  }
});

// Server init
app.listen(PORT, () => {
  console.log(`Servidor is running at http://localhost:${PORT}`);
});
