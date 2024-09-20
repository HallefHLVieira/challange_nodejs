import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import Transaction from './models/Transaction';
import dotenv from 'dotenv'
import Cliente from './models/Client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB configs
// TODO: convert in envs
mongoose.connect('mongodb://hadmin:hadmin123@localhost:27017/tonline?authSource=admin')
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
  
  const startTimeToReadFile = Date.now();
  const content = req.file.buffer.toString();
  const records = content.split('\n');

  try {
    for (const record of records) {
      const [idTemp, nomeTemp, cpfCnpjTemp, dataTemp, valorTemp] = record.split(';');

      if( idTemp ){
        const id = idTemp.split(':')[1];
        const nome = nomeTemp.split(':')[1];
        const cpfCnpj = cpfCnpjTemp.split(':')[1];
        const data = new Date(dataTemp.split(':')[1]);
        const valor = parseFloat(valorTemp.split(':')[1]);

        // Veriy if client exists
        let clientAlreadyExists = await Cliente.findOne({ cpfCnpj });
        
        if (!clientAlreadyExists) {
          clientAlreadyExists = await Cliente.create({ nome, cpfCnpj });
        }

        // Verify if transaction exists
        const transactionAlreadyExists = await Transaction.findOne({ id });
        
        if (!transactionAlreadyExists) {
          const newTransaction = await Transaction.create({
            id,
            data,
            valor,
            clienteId: clientAlreadyExists._id
          });

          clientAlreadyExists.transacoes.push(newTransaction._id);
        
          await clientAlreadyExists.save();

        }else{
          console.error(`Transaction with ID: ${id} already exists. 🧐️`);
        }
      }else{
        console.error('Record is empty. 😅️')
      }
    }

    const endTimeToReadFile = Date.now();
    const executionTime = endTimeToReadFile - startTimeToReadFile;
    
    console.log(`Run time: ${executionTime}ms`);
    res.status(200).send({
      message: 'Upload success. 😎️',
      duraction: executionTime
    });
  }catch (error: any) {
    console.error(error);
    
    res.status(500).send(`🤯️ Error to save transactions: ${error.message}`);
  }
});

// Server init
app.listen(PORT, () => {
  console.log(`Servidor is running at http://localhost:${PORT}`);
});
