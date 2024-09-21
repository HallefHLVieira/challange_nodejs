import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import Transaction from './models/Transaction';
import dotenv from 'dotenv'
import Cliente from './models/Client';
import cors from 'cors'

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  methods: 'GET,POST',
}));

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
app.post('/upload', upload.single('transacoes'), async (req: Request, res: Response) => {
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
        console.log('data antes -> ', dataTemp.split(':')[1]);
        
        const data = new Date(dataTemp.split(':')[1]);
        console.log('data depois -> ', data);
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

app.get('/transactions', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, cpfCnpj, startDate, endDate } = req.query;

    // TODO: create interface to query object
    const queryFilters: any = {};

    // Ammount filter by Client
    if (cpfCnpj) {
      const clienteData = await Cliente.findOne({ cpfCnpj: cpfCnpj });
      
      if (clienteData) {
        queryFilters.clienteId = clienteData._id;
      } else {
        return res.status(404).json({ message: 'Client not found.' });
      }
    }

    // Ammount filter by dates range
    if (startDate || endDate) {
      queryFilters.data = {};
      if (startDate) {
        const start = new Date(startDate as string);
        start.setHours(0, 0, 0, 0);
        queryFilters.data.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        queryFilters.data.$lte = end;
      }
    }

    // implement pagination to front
    const pageNumber = parseInt(page as string, 10);
    const pageLimit = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageLimit;

    const transactions = await Transaction.find(queryFilters)
      .sort({ data: -1 })
      .skip(skip)
      .limit(pageLimit)
      .populate('clienteId', 'nome cpfCnpj')
      .exec();

    const totalTransactions = await Transaction.countDocuments(queryFilters);

    res.status(200).json({
      transactions,
      totalPages: Math.ceil(totalTransactions / pageLimit),
      currentPage: pageNumber,
    });
  } catch (error: any) {
    console.error('Error to fetch transactions:', error.message);
    res.status(500).send('Error to fetch transactions. 🤯️');
  }
});


// Server start
app.listen(PORT, () => {
  console.log(`Servidor is running at http://localhost:${PORT}`);
});
